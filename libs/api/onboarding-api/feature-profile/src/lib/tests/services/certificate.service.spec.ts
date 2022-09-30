import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CertificationEntity } from '@tempus/api/shared/entity';
import { Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';
import { ResourceService } from '@tempus/onboarding-api/feature-account';
import { CertificationService } from '../../services/certificate.service';
import { resourceEntity } from '../mocks/resource.mock';
import { certificationEntity, updateCertificationDtoNullAndMissingData } from '../mocks/certification.mock';

const mockCertificationRepository = createMock<Repository<CertificationEntity>>();
const mockResourceService = createMock<ResourceService>();

describe('CertificationService', () => {
	let moduleRef: TestingModule;
	let certificateService: CertificationService;

	beforeEach(async () => {
		jest.resetModules();
		moduleRef = await Test.createTestingModule({
			providers: [
				CertificationService,
				{
					provide: getRepositoryToken(CertificationEntity),
					useValue: mockCertificationRepository,
				},
				{
					provide: ResourceService,
					useValue: mockResourceService,
				},
			],
		}).compile();

		certificateService = moduleRef.get<CertificationService>(CertificationService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('FindCertificationByResource()', () => {
		it('should find certifications by resource', async () => {
			const certs = [certificationEntity, certificationEntity];
			mockCertificationRepository.find.mockResolvedValue(certs);
			const res = await certificateService.findCertificationByResource(1);
			expect(mockCertificationRepository.find).toBeCalledWith({
				relations: ['resource'],
				where: { resource: { id: 1 } },
			});
			expect(res).toEqual(certs);
		});
	});

	describe('CreateCertification()', () => {
		it('should create certification', async () => {
			const createdCertification: CertificationEntity = {
				...certificationEntity,
				resource: resourceEntity,
				id: 3,
			};

			mockResourceService.getResourceInfo.mockResolvedValue(resourceEntity);
			mockCertificationRepository.save.mockResolvedValue(createdCertification);

			const res = await certificateService.createCertification(1, certificationEntity);

			expect(mockCertificationRepository.save).toBeCalledWith({ ...createdCertification, id: null });
			expect(res).toEqual(createdCertification);
		});
	});

	describe('FindCertificationById()', () => {
		it('should find certification by id', async () => {
			mockCertificationRepository.findOne.mockResolvedValue(certificationEntity);

			const res = await certificateService.findCertificationById(1);

			expect(mockCertificationRepository.findOne).toBeCalledWith(1, { relations: ['resource'] });
			expect(res).toEqual(certificationEntity);
		});
		it('should throw an error if id not found', async () => {
			mockCertificationRepository.findOne.mockResolvedValue(undefined);
			let error;
			try {
				await certificateService.findCertificationById(3);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(NotFoundException);
			expect(error.message).toEqual('Could not find certification with id 3');
		});
	});

	describe('DeleteCertification()', () => {
		it('should delete certificaiton', async () => {
			mockCertificationRepository.findOne.mockResolvedValue(certificationEntity);
			const res = await certificateService.deleteCertification(1);
			expect(mockCertificationRepository.findOne).toBeCalledWith(1);
			expect(mockCertificationRepository.remove).toBeCalledWith(certificationEntity);
		});
		it('should throw an error if id not found', async () => {
			mockCertificationRepository.findOne.mockResolvedValue(undefined);
			let error;
			try {
				await certificateService.deleteCertification(3);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(NotFoundException);
			expect(error.message).toEqual('Could not find certification with id 3');
		});
	});

	describe('EditCertification()', () => {
		it('should edit certification with empty fields', async () => {
			// summary and institution should remain the same as its not specified in the update cert dto (either null or missing)
			const updatedCertificationEntity: CertificationEntity = {
				...certificationEntity,
				title: updateCertificationDtoNullAndMissingData.title,
			};

			mockCertificationRepository.findOne.mockResolvedValue({ ...updatedCertificationEntity, id: 3 });
			mockCertificationRepository.save.mockResolvedValue(updatedCertificationEntity);
			const res = await certificateService.editCertification(updateCertificationDtoNullAndMissingData);

			expect(mockCertificationRepository.findOne).toBeCalledWith(3, { relations: ['resource'] });
			expect(mockCertificationRepository.save).toBeCalledWith({ ...updatedCertificationEntity, id: 3 });
			expect(res).toEqual(updatedCertificationEntity);
		});
		it('should throw an error if id not found', async () => {
			mockCertificationRepository.findOne.mockResolvedValue(undefined);
			let error;
			try {
				await certificateService.editCertification(updateCertificationDtoNullAndMissingData);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(NotFoundException);
			expect(error.message).toEqual('Could not find certification with id 3');
		});
	});
});
