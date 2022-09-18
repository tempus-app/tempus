import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LinkEntity, ProjectEntity } from '@tempus/api/shared/entity';
import { EmailService } from '@tempus/api/shared/feature-email';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { StatusType } from '@tempus/shared-domain';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdatelinkDto } from '@tempus/api/shared/dto';
import { LinkService } from '../../services/link.service';
import { createLinkEntity, dbLink, expiredDBLink, linkEntity, mockProject } from '../mocks/link.mock';

// mock depdencies
const mockLinkRepository = createMock<Repository<LinkEntity>>();
const mockProjectRepository = createMock<Repository<ProjectEntity>>();

const mockEntityManager = { getRepository: (entity: LinkEntity) => mockLinkRepository };
const transactionMock = jest.fn(async passedFunction => await passedFunction(mockEntityManager));

const mockEmailService = {
	sendInvitationEmail: jest.fn(),
};

// mock imports
jest.mock('uuid', () => ({ v4: () => 'fake-uuid' }));
jest.mock('typeorm', () => {
	const originalModule = jest.requireActual('typeorm');

	return {
		__esModule: true,
		...originalModule,
		getManager: () => ({ transaction: transactionMock }),
	};
});

describe('LinkService', () => {
	let moduleRef: TestingModule;
	let linkService: LinkService;

	beforeEach(async () => {
		jest.resetModules();
		moduleRef = await Test.createTestingModule({
			providers: [
				LinkService,
				{
					provide: getRepositoryToken(LinkEntity),
					useValue: mockLinkRepository,
				},
				{
					provide: EmailService,
					useValue: mockEmailService,
				},
				{
					provide: getRepositoryToken(ProjectEntity),
					useValue: mockProjectRepository,
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
			const createdLink = {
				...createLinkEntity,
				id: 3,
				status: StatusType.ACTIVE,
				token: 'fake-uuid',
				project: mockProject,
			};

			mockLinkRepository.save.mockResolvedValue(createdLink);
			mockLinkRepository.findOne.mockResolvedValue(undefined);
			mockProjectRepository.save.mockResolvedValue(mockProject);

			const res = await linkService.createLink(createLinkEntity, 1);

			expect(mockLinkRepository.save).toBeCalledWith({ ...createdLink, id: null });
			expect(mockEmailService.sendInvitationEmail).toBeCalledWith({ ...createdLink, id: 3 });

			expect(mockProjectRepository.findOne).toBeCalledWith(1);

			expect(res).toEqual(createdLink);
		});

		it('should set expiry day to a week later if not specified', async () => {
			mockProjectRepository.save.mockResolvedValue(mockProject);

			const currentDate = new Date();
			const createdLink = {
				...createLinkEntity,
				id: 3,
				token: 'fake-uuid',
				status: StatusType.ACTIVE,
				expiry: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7),
				project: mockProject, // day a week later
			};
			mockLinkRepository.save.mockResolvedValue(createdLink);
			mockLinkRepository.findOne.mockResolvedValue(undefined);

			const res = await linkService.createLink({ ...createLinkEntity, expiry: undefined }, 1);
			expect(mockLinkRepository.save).toBeCalledWith(expect.objectContaining({ ...createdLink, id: null }));

			expect(res).toEqual(expect.objectContaining(createdLink));
		});

		it('should throw an error if the link is in the past or today', async () => {
			let error;
			try {
				await linkService.createLink({ ...createLinkEntity, expiry: new Date() }, 1);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(BadRequestException);
			expect(error.message).toBe('Expiry Date must be in the future');
			expect(mockLinkRepository.save).not.toBeCalled();
		});

		it('should throw an error if link email already exists', async () => {
			let error;
			mockLinkRepository.findOne.mockResolvedValue(createLinkEntity);
			try {
				await linkService.createLink(createLinkEntity, 1);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(BadRequestException);
			expect(error.message).toBe('Link for email test@email.com already exists');
			expect(mockLinkRepository.save).not.toBeCalled();
		});

		it('should only email the link if saving is successful', async () => {
			mockLinkRepository.save.mockRejectedValue(new Error('db constraint'));
			mockLinkRepository.findOne.mockResolvedValue(undefined);

			let error;
			try {
				await linkService.createLink(createLinkEntity, 1);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('db constraint');
			expect(mockEmailService.sendInvitationEmail).not.toBeCalled();
		});

		it('should not save the link if project is not found', async () => {
			mockProjectRepository.findOne.mockResolvedValue(undefined);

			let error;
			try {
				await linkService.createLink(createLinkEntity, 40);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('Could not find project with id 40');
			expect(mockLinkRepository.save).not.toBeCalled();
		});
	});
	describe('findLinkById()', () => {
		it('should successfully get by ID', async () => {
			mockLinkRepository.findOne.mockResolvedValue(dbLink);
			const res = await linkService.findLinkById(3);
			expect(mockLinkRepository.findOne).toBeCalledWith(3, { relations: ['project'] });
			expect(res).toEqual(linkEntity);
		});

		it('should successfully get link by ID and update status if expired', async () => {
			mockLinkRepository.findOne.mockResolvedValue(expiredDBLink);
			mockLinkRepository.save.mockResolvedValue({ ...expiredDBLink, status: StatusType.INACTIVE });

			const res = await linkService.findLinkById(3);
			expect(mockLinkRepository.findOne).toBeCalledWith(3, { relations: ['project'] });

			expect(res).toEqual({ ...linkEntity, expiry: new Date('01-01-2000'), status: StatusType.INACTIVE });
		});

		it('should throw an error if id not found', async () => {
			mockLinkRepository.findOne.mockResolvedValue(undefined);
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
			mockLinkRepository.find.mockResolvedValue([dbLink]);
			const res = await linkService.findLinkByToken('random-string');
			expect(mockLinkRepository.find).toBeCalledWith({ where: { token: 'random-string' } });
			expect(res).toEqual(linkEntity);
		});

		it('should successfully get link by token and update status if expired', async () => {
			mockLinkRepository.find.mockResolvedValue([expiredDBLink]); // needed for edit status
			mockLinkRepository.save.mockResolvedValue({ ...expiredDBLink, status: StatusType.INACTIVE });

			const res = await linkService.findLinkByToken('random-string');
			expect(mockLinkRepository.find).toBeCalledWith({ where: { token: 'random-string' } });
			expect(res).toEqual({ ...linkEntity, expiry: new Date('01-01-2000'), status: StatusType.INACTIVE });
		});

		it('should successfully get link by token and update status if expired', async () => {
			mockLinkRepository.find.mockResolvedValue([]);
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
			mockLinkRepository.findOne.mockResolvedValue(dbLink);
			mockLinkRepository.save.mockResolvedValue({ ...dbLink, status: StatusType.COMPLETED });
			const updatelinkDto = new UpdatelinkDto(3, StatusType.COMPLETED);
			const res = await linkService.editLink(updatelinkDto);
			expect(mockLinkRepository.save).toBeCalledWith({ ...dbLink, status: StatusType.COMPLETED });
			expect(res).toEqual({ ...dbLink, status: StatusType.COMPLETED });
		});

		it('should successfully get link by token and update status if expired', async () => {
			mockLinkRepository.findOne.mockResolvedValue(undefined);
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
