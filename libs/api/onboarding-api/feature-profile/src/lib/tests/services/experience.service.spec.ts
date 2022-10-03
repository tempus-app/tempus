import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExperienceEntity } from '@tempus/api/shared/entity';
import { Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';
import { ResourceService } from '@tempus/onboarding-api/feature-account';
import { resourceEntity } from '../mocks/resource.mock';
import { ExperienceService } from '../../services';
import { experienceEntity, updateExperienceDtoNullAndMissingData } from '../mocks/experience.mock';

const mockExperienceRepository = createMock<Repository<ExperienceEntity>>();
const mockResourceService = createMock<ResourceService>();

describe('ExperienceService', () => {
	let moduleRef: TestingModule;
	let experienceService: ExperienceService;

	beforeEach(async () => {
		jest.resetModules();
		moduleRef = await Test.createTestingModule({
			providers: [
				ExperienceService,
				{
					provide: getRepositoryToken(ExperienceEntity),
					useValue: mockExperienceRepository,
				},
				{
					provide: ResourceService,
					useValue: mockResourceService,
				},
			],
		}).compile();

		experienceService = moduleRef.get<ExperienceService>(ExperienceService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('FindExperienceByResource()', () => {
		it('should find experience by resource', async () => {
			const experiences = [experienceEntity, experienceEntity];
			mockExperienceRepository.find.mockResolvedValue(experiences);
			const res = await experienceService.findExperienceByResource(1);
			expect(mockExperienceRepository.find).toBeCalledWith({
				relations: ['resource', 'location'],
				where: { resource: { id: 1 } },
			});
			expect(res).toEqual(experiences);
		});
	});

	describe('CreateExperience()', () => {
		it('should create experience', async () => {
			const createdExperience: ExperienceEntity = {
				...experienceEntity,
				resource: resourceEntity,
				id: 3,
			};

			mockResourceService.getResourceInfo.mockResolvedValue(resourceEntity);
			mockExperienceRepository.save.mockResolvedValue(createdExperience);

			const res = await experienceService.createExperience(1, experienceEntity);

			expect(mockExperienceRepository.save).toBeCalledWith({ ...createdExperience, id: null });
			expect(res).toEqual(createdExperience);
		});
	});

	describe('FindExperienceById()', () => {
		it('should find experience by id', async () => {
			mockExperienceRepository.findOne.mockResolvedValue(experienceEntity);

			const res = await experienceService.findExperienceById(1);

			expect(mockExperienceRepository.findOne).toBeCalledWith(1, { relations: ['resource', 'location'] });
			expect(res).toEqual(experienceEntity);
		});
		it('should throw an error if id not found', async () => {
			mockExperienceRepository.findOne.mockResolvedValue(undefined);
			let error;
			try {
				await experienceService.findExperienceById(3);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(NotFoundException);
			expect(error.message).toEqual('Could not find experience with id 3');
		});
	});

	describe('DeleteExperience()', () => {
		it('should delete experience', async () => {
			mockExperienceRepository.findOne.mockResolvedValue(experienceEntity);
			const res = await experienceService.deleteExperience(1);
			expect(mockExperienceRepository.findOne).toBeCalledWith(1);
			expect(mockExperienceRepository.remove).toBeCalledWith(experienceEntity);
		});
		it('should throw an error if id not found', async () => {
			mockExperienceRepository.findOne.mockResolvedValue(undefined);
			let error;
			try {
				await experienceService.deleteExperience(3);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(NotFoundException);
			expect(error.message).toEqual('Could not find experience with id 3');
		});
	});

	describe('EditExperience()', () => {
		it('should edit education with empty fields', async () => {
			// summary should remain the same as its not specified in the update cert dto
			const updatedExperienceEntity: ExperienceEntity = {
				...experienceEntity,
				summary: updateExperienceDtoNullAndMissingData.summary,
				location: {
					...experienceEntity.location,
					city: updateExperienceDtoNullAndMissingData.location.city,
				},
			};

			mockExperienceRepository.findOne.mockResolvedValue({ ...experienceEntity, id: 3 });
			mockExperienceRepository.save.mockResolvedValue(updatedExperienceEntity);
			const res = await experienceService.editExperience(updateExperienceDtoNullAndMissingData);

			expect(mockExperienceRepository.findOne).toBeCalledWith(3, { relations: ['location', 'resource'] });
			expect(mockExperienceRepository.save).toBeCalledWith({ ...updatedExperienceEntity, id: 3 });
			expect(res).toEqual(updatedExperienceEntity);
		});
		it('should throw an error if id not found', async () => {
			mockExperienceRepository.findOne.mockResolvedValue(undefined);
			let error;
			try {
				await experienceService.editExperience(updateExperienceDtoNullAndMissingData);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(NotFoundException);
			expect(error.message).toEqual('Could not find experience with id 3');
		});
	});
});
