import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RoleType, StatusType } from '@tempus/shared-domain';
import { CreateLinkDto, UpdatelinkDto } from '@tempus/api/shared/dto';

import { LinkService } from '../../services/link.service';
import { LinkController } from '../../controllers/link.controller';
import { createLinkEntity, linkEntity } from '../mocks/link.mock';

export const mockLinkService = {
	findLinkById: jest.fn().mockResolvedValue(linkEntity),
	editLink: jest.fn().mockResolvedValue({ ...linkEntity, status: StatusType.COMPLETED }),
	findLinkByToken: jest.fn().mockResolvedValue(linkEntity),
	createLink: jest.fn(dto => {
		return { ...dto, id: 5, token: 10, projectId: 1, status: StatusType.ACTIVE };
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
			const updatelinkDto = new UpdatelinkDto(3, StatusType.COMPLETED);
			const res = await linkController.editLinkStatus(updatelinkDto);
			expect(mockLinkService.editLink).toBeCalledWith(updatelinkDto);
			expect(res).toEqual({ ...linkEntity, status: 'COMPLETED' });
		});

		it('should bubble up Edit Link error', async () => {
			mockLinkService.editLink.mockRejectedValue(new TypeError('bad type'));
			const updatelinkDto = new UpdatelinkDto(3, StatusType.COMPLETED);
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
			const createLinkDto = new CreateLinkDto(
				'john',
				'doe',
				'test@email.com',
				new Date('01-03-2024'),
				1,
				RoleType.AVAILABLE_RESOURCE,
			);
			const res = await linkController.createLink(createLinkDto);
			expect(mockLinkService.createLink).toBeCalledWith(
				{
					...createLinkEntity,
					id: undefined,
					token: undefined,
					status: undefined,
					userType: RoleType.AVAILABLE_RESOURCE,
				},
				1,
			);
			expect(res).toEqual({
				...createLinkDto,
				id: 5,
				token: 10,
				projectId: createLinkDto.projectId,
				status: StatusType.ACTIVE,
				user: undefined,
			});
		});

		it('should bubble up Create error', async () => {
			mockLinkService.createLink.mockRejectedValue(new BadRequestException('could not create link'));
			const createLinkDto = new CreateLinkDto(
				'john',
				'doe',
				'test@email.com',
				new Date('01-03-2022'),
				1,
				RoleType.AVAILABLE_RESOURCE,
			);
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
