/* eslint-disable @nrwl/nx/enforce-module-boundaries */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PasswordResetEntity, UserEntity } from '@tempus/api/shared/entity';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CommonService } from '@tempus/api/shared/feature-common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, PasswordResetStatus } from '@tempus/shared-domain';
import { ForbiddenException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { EmailService } from '@tempus/api/shared/feature-email';
import { UserService } from '@tempus/onboarding-api/feature-account';
import { UpdateUserDto } from '@tempus/api/shared/dto';
import { AuthService } from '../auth.service';
import {
	accessTokenPayload,
	authDtoEntity,
	refreshTokenPayloadWithToken,
	newUserEntity,
	loggedInUserEntity,
	tokens,
	invalidRefreshTokenPayloadWithToken,
	user,
	passwordResetMock,
	resetPasswordDto,
	userWithId,
} from './auth.mock';

const mockUserRepository = createMock<Repository<UserEntity>>();
const mockPasswordResetRepository = createMock<Repository<PasswordResetEntity>>();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockEntityManager = { getRepository: (entity: PasswordResetEntity) => mockPasswordResetRepository };

const mockCommonService = createMock<CommonService>();
const transactionMock = jest.fn(async passedFunction => passedFunction(mockEntityManager));

const mockJwtService = {
	signAsync: jest
		.fn()
		.mockResolvedValueOnce('accessTokenMock') // first set of calls
		.mockResolvedValueOnce('refreshTokenMock')
		.mockResolvedValueOnce('accessTokenMock') // second set of calls
		.mockResolvedValueOnce('refreshTokenMock'),
};

const mockConfigService = {
	get: jest.fn().mockImplementation(param => {
		if (param === 'saltSecret') {
			return 10;
		}
		return 'secret';
	}),
};

jest.mock('bcrypt', () => ({
	hash: () => 'fake-hash',
	genSalt: () => 'fake-salt',
	compare: jest.fn(),
}));

const mockEmailService = {
	sendResetEmail: jest.fn(),
};

jest.mock('uuid', () => ({ v4: () => 'fake-uuid' }));

jest.mock('typeorm', () => {
	const originalModule = jest.requireActual('typeorm');

	return {
		__esModule: true,
		...originalModule,
		getManager: () => ({ transaction: transactionMock }),
	};
});

const mockUserService = createMock<UserService>();

describe('AuthService', () => {
	let moduleRef: TestingModule;
	let authService: AuthService;

	beforeEach(async () => {
		moduleRef = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: getRepositoryToken(UserEntity),
					useValue: mockUserRepository,
				},
				{
					provide: EmailService,
					useValue: mockEmailService,
				},
				{
					provide: JwtService,
					useValue: mockJwtService,
				},
				{
					provide: CommonService,
					useValue: mockCommonService,
				},
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
				{
					provide: getRepositoryToken(PasswordResetEntity),
					useValue: mockPasswordResetRepository,
				},
				{
					provide: UserService,
					useValue: mockUserService,
				},
			],
		}).compile();

		authService = moduleRef.get<AuthService>(AuthService);

		// more imports
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('login()', () => {
		it('should successfully login a user and return an accessToken, refreshToken, and user entity', async () => {
			const res = await authService.login(newUserEntity);

			// createTokens
			expect(mockJwtService.signAsync).toHaveBeenNthCalledWith(
				1,
				{ email: newUserEntity.email, roles: null },
				{ expiresIn: 900, secret: mockConfigService.get() },
			);
			expect(mockJwtService.signAsync).toHaveBeenNthCalledWith(
				2,
				{ email: newUserEntity.email },
				{ expiresIn: 7200, secret: mockConfigService.get() },
			);

			// updateRefreshTokenHash
			expect(mockUserRepository.save).toBeCalledWith({ ...newUserEntity, refreshToken: 'fake-hash' });
			const authDto = {
				...authDtoEntity,
				user: { ...newUserEntity, password: null, refreshToken: null },
			};
			expect(res).toEqual(authDto);
		});
	});

	describe('refreshToken()', () => {
		it('should return new tokens for a logged in user', async () => {
			compare.mockImplementation(() => true);

			mockCommonService.findByEmail.mockResolvedValue(loggedInUserEntity);

			const res = await authService.refreshToken(refreshTokenPayloadWithToken);

			expect(mockCommonService.findByEmail).toBeCalledWith(refreshTokenPayloadWithToken.email);

			// createTokens
			expect(mockJwtService.signAsync).toHaveBeenNthCalledWith(
				1,
				{ email: loggedInUserEntity.email, roles: null },
				{ expiresIn: 900, secret: mockConfigService.get() },
			);
			expect(mockJwtService.signAsync).toHaveBeenNthCalledWith(
				2,
				{ email: loggedInUserEntity.email },
				{ expiresIn: 7200, secret: mockConfigService.get() },
			);

			// updateRefreshTokenHash
			expect(mockUserRepository.save).toBeCalledWith({ ...loggedInUserEntity, refreshToken: 'fake-hash' });

			expect(res).toEqual(tokens);
		});

		it('should throw an error as user is not logged in', async () => {
			// need to reset mock data since jest.clearAllMocks not working...
			newUserEntity.refreshToken = null;
			mockCommonService.findByEmail.mockResolvedValue(newUserEntity);

			let error;
			try {
				await authService.refreshToken(invalidRefreshTokenPayloadWithToken);
				expect(mockCommonService.findByEmail).toBeCalledWith(invalidRefreshTokenPayloadWithToken.email);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(ForbiddenException);
			expect(error.message).toBe('User not logged in');
		});

		it('should throw an error as refreshTokens do not match', async () => {
			compare.mockImplementation(() => false);

			mockCommonService.findByEmail.mockResolvedValue(loggedInUserEntity);

			let error;
			try {
				await authService.refreshToken(refreshTokenPayloadWithToken);
				expect(mockCommonService.findByEmail).toBeCalledWith(refreshTokenPayloadWithToken.email);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(ForbiddenException);
			expect(error.message).toBe('Access Denied');
		});
	});

	describe('forget password()', () => {
		it('should successfully save details and send email', async () => {
			mockCommonService.findByEmail.mockResolvedValue(user);
			const currentDate = new Date();
			const resetData = new PasswordResetEntity(
				null,
				user,
				new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1),
				'fake-uuid',
				PasswordResetStatus.VALID,
			);

			await authService.forgotPassword(user.email);
			expect(mockCommonService.findByEmail).toBeCalledWith(user.email);
			expect(mockEmailService.sendResetEmail).toBeCalledWith(resetData);
			expect(mockPasswordResetRepository.save).toBeCalledWith(resetData);
		});

		it('should successfully save details and send email, and set old active codes to invalid', async () => {
			mockCommonService.findByEmail.mockResolvedValue(user);
			mockPasswordResetRepository.find.mockResolvedValue([passwordResetMock]);
			const currentDate = new Date();
			const resetData = new PasswordResetEntity(
				null,
				user,
				new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1),
				'fake-uuid',
				PasswordResetStatus.VALID,
			);

			await authService.forgotPassword(user.email);
			expect(mockCommonService.findByEmail).toBeCalledWith(user.email);
			expect(mockEmailService.sendResetEmail).toBeCalledWith(resetData);
			expect(mockPasswordResetRepository.save).nthCalledWith(1, {
				...passwordResetMock,
				status: PasswordResetStatus.INVALID,
			});

			expect(mockPasswordResetRepository.save).nthCalledWith(2, resetData);
		});

		it('should return error if email cannot be found', async () => {
			mockCommonService.findByEmail.mockRejectedValue(
				new Error('Could not find user with email wrong@email.com'),
			);
			let error;
			try {
				await authService.forgotPassword(user.email);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('Could not find user with email wrong@email.com');
		});

		it('should return error and not save details if email cannot be sent', async () => {
			mockEmailService.sendResetEmail.mockRejectedValue(new Error('Something went wrong'));
			mockCommonService.findByEmail.mockResolvedValue(user);

			let error;
			try {
				await authService.forgotPassword(user.email);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('Email unable to be sent.');
		});
	});

	describe('reset password()', () => {
		it('should successfully reset user password', async () => {
			mockPasswordResetRepository.find.mockResolvedValue([passwordResetMock]);
			await authService.resetPassword(resetPasswordDto);
			expect(mockPasswordResetRepository.find).toBeCalledWith({
				where: { token: resetPasswordDto.token },
				relations: ['user'],
			});

			const updateUserDto = new UpdateUserDto(passwordResetMock.user.id);
			updateUserDto.password = resetPasswordDto.newPassword;
			expect(mockUserService.updateUser).toBeCalledWith(updateUserDto);

			expect(mockPasswordResetRepository.save).toBeCalledWith({
				...passwordResetMock,
				status: PasswordResetStatus.INVALID,
			});
		});

		it('should throw an erorr if the token does not exist', async () => {
			mockPasswordResetRepository.find.mockResolvedValue([]);

			let error;
			try {
				await authService.resetPassword(resetPasswordDto);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('Invalid token provided');
		});

		it('should throw an erorr if the token and email mismatch', async () => {
			mockPasswordResetRepository.find.mockResolvedValue([
				{ ...passwordResetMock, user: { ...userWithId, email: 'different.email@gmail.com' } },
			]);

			let error;
			try {
				await authService.resetPassword(resetPasswordDto);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('Invalid token or email provided');
		});

		it('should throw an erorr if the token is expired', async () => {
			mockPasswordResetRepository.find.mockResolvedValue([
				{ ...passwordResetMock, expiry: new Date('2000-08-16') },
			]);

			let error;
			try {
				await authService.resetPassword(resetPasswordDto);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('Reset link has expired');
			expect(mockPasswordResetRepository.save).toBeCalledWith({
				...passwordResetMock,
				expiry: new Date('2000-08-16'),
				status: PasswordResetStatus.INVALID,
			});
		});

		it('should throw an erorr if the token is invalid', async () => {
			mockPasswordResetRepository.find.mockResolvedValue([
				{ ...passwordResetMock, status: PasswordResetStatus.INVALID },
			]);

			let error;
			try {
				await authService.resetPassword(resetPasswordDto);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('Invalid reset link');
		});
	});

	describe('logout()', () => {
		it('should successfully logout a user', async () => {
			mockCommonService.findByEmail.mockResolvedValue(loggedInUserEntity);

			await authService.logout(accessTokenPayload);
			expect(mockCommonService.findByEmail).toBeCalledWith(accessTokenPayload.email);
			expect(mockUserRepository.save).toBeCalledWith(loggedInUserEntity);
		});

		it('should return an error since it could not find user', async () => {
			mockCommonService.findByEmail.mockRejectedValue(
				new Error('Could not find user with email wrong@email.com'),
			);
			let error;
			try {
				await authService.logout(new JwtPayload('wrong@email.com', null, null, null));
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('Could not find user with email wrong@email.com');
		});
	});

	/*describe('validateUser()', () => {
		it('should successfully return the user', async () => {
			compare.mockImplementation(() => true);

			mockCommonService.findByEmail.mockResolvedValue(newUserEntity);

			const res = await authService.validateUser(newUserEntity.email, newUserEntity.password);

			expect(mockCommonService.findByEmail).toBeCalledWith(newUserEntity.email);

			expect(res).toEqual(newUserEntity);
		});

		it('should return null since passwords do not match', async () => {
			compare.mockImplementation(() => false);
			mockCommonService.findByEmail.mockResolvedValue(newUserEntity);

			const res = await authService.validateUser(newUserEntity.email, newUserEntity.password);

			expect(mockCommonService.findByEmail).toBeCalledWith(newUserEntity.email);
			expect(res).toEqual(null);
		});
	});*/
});
