import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ResourceEntity, UserEntity, ViewEntity } from '@tempus/api/shared/entity';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CommonService } from '@tempus/api/shared/feature-common';
import { UpdateUserDto } from '@tempus/api/shared/dto';
import { NotFoundException } from '@nestjs/common';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { EmailService } from '@tempus/api/shared/feature-email';
import { UserService } from '../../services';
import { createUserEntity, dbUser, jwtPayload, userEntity } from '../mocks/user.mock';

// mock depdencies
const mockUserRepository = createMock<Repository<UserEntity>>();
const mockResourceRepository = createMock<Repository<ResourceEntity>>();
const mockViewReposity = createMock<Repository<ViewEntity>>();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockEntityManager = { getRepository: (entity: UserEntity) => mockUserRepository };
// eslint-disable-next-line @typescript-eslint/return-await
const transactionMock = jest.fn(async passedFunction => await passedFunction(mockEntityManager));

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
const mockEmailService = {
	sendDeletedAccountEmail: jest.fn(),
};

describe('UserService', () => {
	let moduleRef: TestingModule;
	let userService: UserService;

	beforeEach(async () => {
		jest.resetModules();
		moduleRef = await Test.createTestingModule({
			providers: [
				UserService,
				ConfigService,
				CommonService,
				{
					provide: EmailService,
					useValue: mockEmailService,
				},
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
					useValue: mockViewReposity,
				},
			],
		}).compile();

		userService = moduleRef.get<UserService>(UserService);

		// more imports
	});

	afterEach(() => {
		jest.clearAllMocks();
	});
	describe('createUser()', () => {
		it('should successfully create a user', async () => {
			const createdUser = {
				...createUserEntity,
			};
			createUserEntity.password = 'password';
			mockUserRepository.findOne.mockResolvedValue(undefined);
			mockUserRepository.save.mockResolvedValue(createUserEntity);

			const res = await userService.createUser(createUserEntity);

			expect(res.firstName).toEqual(createdUser.firstName);
			expect(res.lastName).toEqual(createdUser.lastName);
			expect(res.id).toEqual(createdUser.id);
		});

		it('should successfully fail to create a user that already exists', async () => {
			createUserEntity.password = 'password';
			let error;
			mockUserRepository.findOne.mockResolvedValue(createUserEntity);
			try {
				await userService.createUser(createUserEntity);
			} catch (e) {
				error = e;
			}
			expect(error.message).toBe('Cannot create a user that already exists');
		});
	});

	describe('getUser()', () => {
		it('should successfully get a user by email', async () => {
			mockUserRepository.find.mockResolvedValue([dbUser]);
			const res = await userService.getUser(jwtPayload);
			expect(mockUserRepository.find).toBeCalledWith({ where: { email: 'test@email.com' } });

			expect(res).toEqual({ ...userEntity });
		});

		it('should successfully throw error getting a user that does not exist', async () => {
			mockUserRepository.find.mockResolvedValue([undefined]);
			let error;
			try {
				await userService.getUser({ ...jwtPayload, email: 'test2@email.com' });
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(NotFoundException);
			expect(error.message).toBe('Could not find user with email test2@email.com');
			expect(mockUserRepository.find).toBeCalledWith({ where: { email: 'test2@email.com' } });
		});
	});

	describe('getAllUsers()', () => {
		it('should successfully get all users', async () => {
			mockUserRepository.find.mockResolvedValue([dbUser]);
			const res = await userService.getAllUsers();
			expect(mockUserRepository.find).toBeCalled();

			expect(res[0]).toEqual(userEntity);
		});
	});

	describe('updateUser()', () => {
		it('should successfully edit a user', async () => {
			mockUserRepository.findOne.mockResolvedValue(dbUser);
			mockUserRepository.save.mockResolvedValue({ ...dbUser, firstName: 'jake' });
			const updateUserDto = new UpdateUserDto(4);
			updateUserDto.firstName = 'jake';
			const res = await userService.updateUser(updateUserDto);
			expect(mockUserRepository.save).toBeCalledWith({ ...dbUser, firstName: 'jake' });
			expect(res).toEqual({ ...dbUser, firstName: 'jake' });
		});

		it('should fail to edit a user that doesnt exist', async () => {
			mockUserRepository.findOne.mockResolvedValue(undefined);
			const updateUserDto = new UpdateUserDto(4);
			let error;
			try {
				await userService.updateUser(updateUserDto);
			} catch (e) {
				error = e;
			}
			expect(mockUserRepository.save).not.toBeCalled();
			expect(error.message).toBe(`Could not find user with id 4`);
			expect(error).toBeInstanceOf(NotFoundException);
		});
	});

	describe('deleteUser()', () => {
		it('should successfully delete a user', async () => {
			mockUserRepository.findOne.mockResolvedValue(dbUser);
			mockUserRepository.remove.mockResolvedValue(dbUser);
			await userService.deleteUser(dbUser.id);
			expect(mockUserRepository.findOne).toBeCalledWith(4);
			expect(mockUserRepository.remove).toBeCalledWith({ ...dbUser });
		});
	});
});
