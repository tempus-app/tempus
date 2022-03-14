import { Test, TestingModule } from '@nestjs/testing';
import { CreateLinkDto, StatusType, UpdatelinkDto } from '@tempus/shared-domain';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { LinkService } from '../../services/link.service';
import { LinkController } from '../../controllers/link.controller';
import { linkEntity } from '../mocks/link.mock';

export const mockLinkService = {
	findLinkById: jest.fn().mockResolvedValue(linkEntity),
	editLink: jest.fn().mockResolvedValue({ ...linkEntity, status: 'COMPLETED' }),
	findLinkByToken: jest.fn().mockResolvedValue(linkEntity),
	createLink: jest.fn(dto => {
		return { ...dto, id: 5, token: 10 };
	}),
};
describe('LinkController', () => {
	let moduleRef: TestingModule;
	let linkController: LinkController;
	beforeEach(async () => {
		moduleRef = await Test.createTestingModule({
			controllers: [LinkController],
			providers: [LinkService],
		})
			.overrideProvider(LinkService)
			.useValue(mockLinkService)
			.compile();

		linkController = moduleRef.get<LinkController>(LinkController);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('GET', () => {
		describe('GET By ID', () => {
			it('should successfully get by ID', async () => {
				const res = await linkController.getLink(3);
				expect(mockLinkService.findLinkById).toBeCalledWith(3);
				expect(res).toEqual(linkEntity);
			});

			it('should bubble up Get By ID error', async () => {
				mockLinkService.findLinkById.mockRejectedValue(new NotFoundException('link not found'));
				let error;
				try {
					await linkController.getLink(3);
				} catch (e) {
					error = e;
				}
				expect(error).toBeInstanceOf(NotFoundException);
				expect(error.message).toBe('link not found');
			});
		});

		describe('GET By Token', () => {
			it('should successfully get by token value', async () => {
				const res = await linkController.getLinkByToken('random-string');
				expect(mockLinkService.findLinkByToken).toBeCalledWith('random-string');
				expect(res).toEqual(linkEntity);
			});

			it('should bubble up Get By token error', async () => {
				mockLinkService.findLinkByToken.mockRejectedValue(new NotFoundException('link not found'));

				let error;
				try {
					await linkController.getLinkByToken('random-string');
				} catch (e) {
					error = e;
				}
				expect(error).toBeInstanceOf(NotFoundException);
				expect(error.message).toBe('link not found');
			});
		});
	});

	describe('EDIT', () => {
		it('should successfully edit a link', async () => {
			const updatelinkDto: UpdatelinkDto = new UpdatelinkDto(3, StatusType.COMPLETED);
			const res = await linkController.editLinkStatus(updatelinkDto);
			expect(mockLinkService.editLink).toBeCalledWith(updatelinkDto);
			expect(res).toEqual({ ...linkEntity, status: 'COMPLETED' });
		});

		it('should bubble up Edit Link error', async () => {
			mockLinkService.editLink.mockRejectedValue(new TypeError('bad type'));
			const updatelinkDto: UpdatelinkDto = new UpdatelinkDto(3, StatusType.COMPLETED);
			let error;
			try {
				await linkController.editLinkStatus(updatelinkDto);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(TypeError);
			expect(error.message).toBe('bad type');
		});
	});

	describe('CREATE', () => {
		it('should successfully create a link', async () => {
			const createLinkDto: CreateLinkDto = new CreateLinkDto('john', 'doe', 'test@email.com', new Date('01-03-2022'));
			const res = await linkController.createLink(createLinkDto);
			expect(mockLinkService.createLink).toBeCalledWith(createLinkDto);
			expect(res).toEqual({ ...createLinkDto, id: 5, token: 10 });
		});

		it('should bubble up Create error', async () => {
			mockLinkService.createLink.mockRejectedValue(new BadRequestException('could not create link'));

			const createLinkDto: CreateLinkDto = new CreateLinkDto('john', 'doe', 'test@email.com', new Date('01-03-2022'));
			let error;
			try {
				await linkController.createLink(createLinkDto);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(BadRequestException);
			expect(error.message).toBe('could not create link');
		});
	});
});
