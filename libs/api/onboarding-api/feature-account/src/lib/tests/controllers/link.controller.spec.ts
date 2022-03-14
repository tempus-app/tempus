import { Test, TestingModule } from '@nestjs/testing';
import { CreateLinkDto, StatusType, UpdatelinkDto } from '@tempus/shared-domain';
import { LinkService } from '../../services/link.service';
import { LinkController } from '../../controllers/link.controller';
import { mockEntity } from '../mocks/link.mock';

export const mockLinkService = {
	findLinkById: jest.fn(() => {
		return mockEntity;
	}),
	editLink: jest.fn(() => {
		return { ...mockEntity, status: 'COMPLETED' };
	}),
	findLinkByToken: jest.fn(() => {
		return mockEntity;
	}),
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

	describe('GET', () => {
		it('should successfully get by ID', async () => {
			const res = await linkController.getLink(3);
			expect(mockLinkService.findLinkById).toBeCalledWith(3);
			expect(res).toEqual(mockEntity);
		});

		it('should successfully get by token value', async () => {
			const res = await linkController.getLinkByToken('random-string');
			expect(mockLinkService.findLinkByToken).toBeCalledWith('random-string');
			expect(res).toEqual(mockEntity);
		});
	});

	describe('EDIT', () => {
		it('should successfully edit a link', async () => {
			const updatelinkDto: UpdatelinkDto = new UpdatelinkDto(3, StatusType.COMPLETED);
			const res = await linkController.editLinkStatus(updatelinkDto);
			expect(mockLinkService.editLink).toBeCalledWith(updatelinkDto);
			expect(res).toEqual({ ...mockEntity, status: 'COMPLETED' });
		});
	});

	describe('CREATE', () => {
		it('should successfully create a link', async () => {
			const createLinkDto: CreateLinkDto = new CreateLinkDto('john', 'doe', 'test@email.com', new Date('01-03-2022'));
			const res = await linkController.createLink(createLinkDto);
			expect(mockLinkService.createLink).toBeCalledWith(createLinkDto);
			expect(res).toEqual({ ...createLinkDto, id: 5, token: 10 });
		});
	});
});
