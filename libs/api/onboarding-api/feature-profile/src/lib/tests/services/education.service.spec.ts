import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EducationEntity } from '@tempus/api/shared/entity';
import { Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';
import { ResourceService } from '@tempus/onboarding-api/feature-account';
import { resourceEntity } from '../mocks/resource.mock';
import { EducationService } from '../../services';
import { educationEntity, updateEducationDtoNullAndMissingData } from '../mocks/education.mock';

const mockEducationRepository = createMock<Repository<EducationEntity>>();
const mockResourceService = createMock<ResourceService>();

describe('EducationService', () => {
	let moduleRef: TestingModule;
	let educationService: EducationService;

	beforeEach(async () => {
		jest.resetModules();
		moduleRef = await Test.createTestingModule({
			providers: [
				EducationService,
				{
					provide: getRepositoryToken(EducationEntity),
					useValue: mockEducationRepository,
				},
				{
					provide: ResourceService,
					useValue: mockResourceService,
				},
			],
		}).compile();

		educationService = moduleRef.get<EducationService>(EducationService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('FindEducationByResource()', () => {
		it('should find education by resource', async () => {
			const educations = [educationEntity, educationEntity];
			mockEducationRepository.find.mockResolvedValue(educations);
			const res = await educationService.findEducationByResource(1);
			expect(mockEducationRepository.find).toBeCalledWith({ relations: ['location'], where: { resource: { id: 1 } } });
			expect(res).toEqual(educations);
		});
	});

	describe('CreateEducation()', () => {
		it('should create education', async () => {
			const createdEducation: EducationEntity = {
				...educationEntity,
				resource: resourceEntity,
				id: 3,
			};

			mockResourceService.getResourceInfo.mockResolvedValue(resourceEntity);
			mockEducationRepository.save.mockResolvedValue(createdEducation);

			const res = await educationService.createEducation(1, educationEntity);

			expect(mockEducationRepository.save).toBeCalledWith({ ...createdEducation, id: null });
			expect(res).toEqual(createdEducation);
		});
	});

	describe('FindEducationById()', () => {
		it('should find education by id', async () => {
			mockEducationRepository.findOne.mockResolvedValue(educationEntity);

			const res = await educationService.findEducationById(1);

			expect(mockEducationRepository.findOne).toBeCalledWith(1, { relations: ['resource', 'location'] });
			expect(res).toEqual(educationEntity);
		});
		it('should throw an error if id not found', async () => {
			mockEducationRepository.findOne.mockResolvedValue(undefined);
			let error;
			try {
				await educationService.findEducationById(3);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(NotFoundException);
			expect(error.message).toEqual('Could not find education with id 3');
		});
	});

	describe('DeleteEducation()', () => {
		it('should delete education', async () => {
			mockEducationRepository.findOne.mockResolvedValue(educationEntity);
			const res = await educationService.deleteEducation(1);
			expect(mockEducationRepository.findOne).toBeCalledWith(1);
			expect(mockEducationRepository.remove).toBeCalledWith(educationEntity);
		});
		it('should throw an error if id not found', async () => {
			mockEducationRepository.findOne.mockResolvedValue(undefined);
			let error;
			try {
				await educationService.deleteEducation(3);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(NotFoundException);
			expect(error.message).toEqual('Could not find education with id 3');
		});
	});

	describe('EditEducation()', () => {
		it('should edit education with empty fields', async () => {
			// summary should remain the same as its not specified in the update cert dto
			const updatedEducationEntity: EducationEntity = {
				...educationEntity,
				institution: updateEducationDtoNullAndMissingData.institution,
				location: {
					...educationEntity.location,
					city: updateEducationDtoNullAndMissingData.location.city,
				},
			};

			mockEducationRepository.findOne.mockResolvedValue({ ...updatedEducationEntity, id: 3 });
			mockEducationRepository.save.mockResolvedValue(updatedEducationEntity);
			const res = await educationService.editEducation(updateEducationDtoNullAndMissingData);

			expect(mockEducationRepository.findOne).toBeCalledWith(3, { relations: ['location', 'resource'] });
			expect(mockEducationRepository.save).toBeCalledWith({ ...updatedEducationEntity, id: 3 });
			expect(res).toEqual(updatedEducationEntity);
		});
		it('should throw an error if id not found', async () => {
			mockEducationRepository.findOne.mockResolvedValue(undefined);
			let error;
			try {
				await educationService.editEducation(updateEducationDtoNullAndMissingData);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(NotFoundException);
			expect(error.message).toEqual('Could not find education with id 3');
		});
	});
});
