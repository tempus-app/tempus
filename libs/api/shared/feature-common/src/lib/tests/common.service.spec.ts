import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ResourceEntity, UserEntity, ViewEntity } from '@tempus/api/shared/entity';
import { Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';
import { CommonService } from '../common.service';
import { badUserEntity, businessOwnerEntity, resourceEntity } from './mocks/user.mock';

const mockUserRepository = createMock<Repository<UserEntity>>();
const mockResourceRepository = createMock<Repository<ResourceEntity>>();
const mockViewRepository = createMock<Repository<ViewEntity>>();

describe('CommonService', () => {
	let moduleRef: TestingModule;
	let commonService: CommonService;

	beforeEach(async () => {
		jest.resetModules();
		moduleRef = await Test.createTestingModule({
			providers: [
				CommonService,
				{
					provide: getRepositoryToken(UserEntity),
					useValue: mockUserRepository,
				},
				{
					provide: getRepositoryToken(ResourceEntity),
					useValue: mockResourceRepository,
				},
				{
					provide: getRepositoryToken(ViewEntity),
					useValue: mockViewRepository,
				},
			],
		}).compile();

		commonService = moduleRef.get<CommonService>(CommonService);

		// more imports
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('FindByEmail()', () => {
		it('should find business owner by email', async () => {
			mockUserRepository.find.mockResolvedValue([businessOwnerEntity]);
			const res = await commonService.findByEmail(resourceEntity.email);
			expect(mockUserRepository.find).toBeCalledWith({
				where: { email: resourceEntity.email },
			});
			expect(mockResourceRepository.find).not.toBeCalled();
			expect(res).toEqual(businessOwnerEntity);
		});

		it('should get extra details if user is a resource', async () => {
			mockUserRepository.find.mockResolvedValue([resourceEntity]);
			mockResourceRepository.find.mockResolvedValue([resourceEntity]);

			const res = await commonService.findByEmail(resourceEntity.email);
			expect(mockUserRepository.find).toBeCalledWith({
				where: { email: resourceEntity.email },
			});

			expect(mockResourceRepository.find).toBeCalledWith({
				where: { email: resourceEntity.email },
				relations: ['location', 'projects', 'views', 'experiences', 'educations', 'skills', 'certifications'],
			});
			expect(res).toEqual(resourceEntity);
		});

		it('should throw error if user does not exist', async () => {
			mockUserRepository.find.mockResolvedValue([]);
			const badResource = { ...resourceEntity, email: 'bad.email@yahoo.com' };

			let error;
			try {
				await commonService.findByEmail(badResource.email);
			} catch (e) {
				error = e;
			}
			expect(mockUserRepository.find).toBeCalledWith({
				where: { email: badResource.email },
			});
			expect(error).toBeInstanceOf(NotFoundException);
			expect(error.message).toBe(`Could not find user with email ${badResource.email}`);
		});

		it('should throw error if user does not have a role', async () => {
			mockUserRepository.find.mockResolvedValue([badUserEntity]);
			mockResourceRepository.find.mockResolvedValue([]);

			let error;
			try {
				await commonService.findByEmail(badUserEntity.email);
			} catch (e) {
				error = e;
			}
			expect(mockUserRepository.find).toBeCalledWith({
				where: { email: badUserEntity.email },
			});
			expect(mockResourceRepository.find).toBeCalledWith({
				where: { email: badUserEntity.email },
				relations: ['location', 'projects', 'views', 'experiences', 'educations', 'skills', 'certifications'],
			});

			expect(error).toBeInstanceOf(NotFoundException);
			expect(error.message).toBe(`Could not find resource with email ${badUserEntity.email}`);
		});
	});

	describe('FindById()', () => {
		it('should find business owner by id', async () => {
			mockUserRepository.findOne.mockResolvedValue(businessOwnerEntity);
			const res = await commonService.findById(businessOwnerEntity.id);
			expect(mockUserRepository.findOne).toBeCalledWith(businessOwnerEntity.id);
			expect(mockResourceRepository.findOne).not.toBeCalled();
			expect(res).toEqual(businessOwnerEntity);
		});

		it('should find resource by id', async () => {
			mockUserRepository.findOne.mockResolvedValue(resourceEntity);
			mockResourceRepository.findOne.mockResolvedValue(resourceEntity);

			const res = await commonService.findById(resourceEntity.id);
			expect(mockUserRepository.findOne).toBeCalledWith(resourceEntity.id);
			expect(mockResourceRepository.findOne).toBeCalledWith(resourceEntity.id);
			expect(res).toEqual(resourceEntity);
		});

		it('should throw error if user does not exist', async () => {
			mockUserRepository.findOne.mockResolvedValue(undefined);
			const badResource = { ...resourceEntity, id: 100 };

			let error;
			try {
				await commonService.findById(badResource.id);
			} catch (e) {
				error = e;
			}
			expect(mockUserRepository.findOne).toBeCalledWith(badResource.id);

			expect(error).toBeInstanceOf(NotFoundException);
			expect(error.message).toBe(`Could not find user with id ${badResource.id}`);
		});

		it('should throw error if user does not have a role', async () => {
			mockUserRepository.findOne.mockResolvedValue(badUserEntity);
			mockResourceRepository.findOne.mockResolvedValue(undefined);

			let error;
			try {
				await commonService.findById(badUserEntity.id);
			} catch (e) {
				error = e;
			}
			expect(mockUserRepository.findOne).toBeCalledWith(badUserEntity.id);

			expect(mockResourceRepository.findOne).toBeCalledWith(badUserEntity.id);

			expect(error).toBeInstanceOf(NotFoundException);
			expect(error.message).toBe(`Could not find resource with id ${badUserEntity.id}`);
		});
	});
});
