import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LinkEntity } from '@tempus/api/shared/entity';
import { EmailService } from '@tempus/api/shared/feature-email';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { StatusType, UpdatelinkDto } from '@tempus/shared-domain';
import { NotFoundException } from '@nestjs/common';
import { LinkService } from '../../services/link.service';
import { createLinkEntity, dbLink, expiredDBLink, linkEntity } from '../mocks/link.mock';

// mock depdencies
const mockRepository = createMock<Repository<LinkEntity>>();

const mockEmailService = {
	sendInvitationEmail: jest.fn(),
};

// mock imports
jest.mock('uuid', () => ({ v4: () => 'fake-uuid' }));

describe('LinkService', () => {
	let moduleRef: TestingModule;
	let linkService: LinkService;

	beforeEach(async () => {
		moduleRef = await Test.createTestingModule({
			providers: [
				LinkService,
				{
					provide: getRepositoryToken(LinkEntity),
					useValue: mockRepository,
				},
				{
					provide: EmailService,
					useValue: mockEmailService,
				},
			],
		}).compile();

		linkService = moduleRef.get<LinkService>(LinkService);

		// more imports
	});

	afterEach(() => {
		jest.clearAllMocks();
	});
	describe('createLink()', () => {
		it('should successfully create a link from entity and send email', async () => {
			const createdLink = { ...createLinkEntity, id: 3, status: StatusType.ACTIVE, token: 'fake-uuid' };

			mockRepository.save.mockResolvedValue(createdLink);

			const res = await linkService.createLink(createLinkEntity);

			expect(mockEmailService.sendInvitationEmail).toBeCalledWith({ ...createdLink, id: null });
			expect(mockRepository.save).toBeCalledWith({ ...createdLink, id: null });

			expect(res).toEqual({ ...createdLink, id: 3 });
		});

		it('should set expiry day to a week later if not specified', async () => {
			const currentDate = new Date();
			const createdLink = {
				...createLinkEntity,
				id: 3,
				token: 'fake-uuid',
				status: StatusType.ACTIVE,
				expiry: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7), // day a week later
			};
			mockRepository.save.mockResolvedValue(createdLink);

			const res = await linkService.createLink({ ...createLinkEntity, expiry: undefined });
			expect(mockRepository.save).toBeCalledWith(expect.objectContaining({ ...createdLink, id: null }));

			expect(res).toEqual(expect.objectContaining({ ...createdLink, id: 3 }));
		});

		it('should not save the link if email linking fails', async () => {
			mockEmailService.sendInvitationEmail.mockRejectedValue(new Error('timeout'));

			let error;
			try {
				await linkService.createLink(createLinkEntity);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('timeout');
			expect(mockRepository.save).not.toBeCalled();
		});
	});
	describe('findLinkById()', () => {
		it('should successfully get by ID', async () => {
			mockRepository.findOne.mockResolvedValue(dbLink);
			const res = await linkService.findLinkById(3);
			expect(mockRepository.findOne).toBeCalledWith(3);
			expect(res).toEqual(linkEntity);
		});

		it('should successfully get link by ID and update status if expired', async () => {
			mockRepository.findOne.mockResolvedValue(expiredDBLink);
			mockRepository.save.mockResolvedValue({ ...expiredDBLink, status: StatusType.INACTIVE });

			const res = await linkService.findLinkById(3);
			expect(mockRepository.findOne).toBeCalledWith(3);

			expect(res).toEqual({ ...linkEntity, expiry: new Date('01-01-2000'), status: StatusType.INACTIVE });
		});

		it('should throw an error if id not found', async () => {
			mockRepository.findOne.mockResolvedValue(undefined);
			let error;
			try {
				await linkService.findLinkById(3);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(NotFoundException);
		});
	});

	describe('findLinkByToken()', () => {
		it('should successfully get by Token', async () => {
			mockRepository.find.mockResolvedValue([dbLink]);
			const res = await linkService.findLinkByToken('random-string');
			expect(mockRepository.find).toBeCalledWith({ where: { token: 'random-string' } });
			expect(res).toEqual(linkEntity);
		});

		it('should successfully get link by token and update status if expired', async () => {
			mockRepository.find.mockResolvedValue([expiredDBLink]); // needed for edit status
			mockRepository.save.mockResolvedValue({ ...expiredDBLink, status: StatusType.INACTIVE });

			const res = await linkService.findLinkByToken('random-string');
			expect(mockRepository.find).toBeCalledWith({ where: { token: 'random-string' } });
			expect(res).toEqual({ ...linkEntity, expiry: new Date('01-01-2000'), status: StatusType.INACTIVE });
		});

		it('should successfully get link by token and update status if expired', async () => {
			mockRepository.find.mockResolvedValue([]);
			let error;
			try {
				await linkService.findLinkByToken('random-string');
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(NotFoundException);
		});
	});
	describe('editLink()', () => {
		it('should successfully edit token status', async () => {
			mockRepository.findOne.mockResolvedValue(dbLink);
			mockRepository.save.mockResolvedValue({ ...dbLink, status: StatusType.COMPLETED });
			const updatelinkDto = new UpdatelinkDto(3, StatusType.COMPLETED);
			const res = await linkService.editLink(updatelinkDto);
			expect(mockRepository.save).toBeCalledWith({ ...dbLink, status: StatusType.COMPLETED });
			expect(res).toEqual({ ...dbLink, status: StatusType.COMPLETED });
		});

		it('should successfully get link by token and update status if expired', async () => {
			mockRepository.findOne.mockResolvedValue(undefined);
			let error;
			try {
				const updatelinkDto = new UpdatelinkDto(3, StatusType.COMPLETED);
				await linkService.editLink(updatelinkDto);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(NotFoundException);
		});
	});
});
