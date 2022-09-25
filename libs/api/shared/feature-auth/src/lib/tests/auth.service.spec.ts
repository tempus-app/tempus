import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '@tempus/api/shared/entity';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CommonService } from '@tempus/api/shared/feature-common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '@tempus/shared-domain';
import { ForbiddenException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { AuthService } from '../auth.service';
import {
	accessTokenPayload,
	authDtoEntity,
	refreshTokenPayloadWithToken,
	newUserEntity,
	loggedInUserEntity,
	tokens,
	invalidRefreshTokenPayloadWithToken,
} from './auth.mock';

const mockUserRepository = createMock<Repository<UserEntity>>();
const mockCommonService = createMock<CommonService>();

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

	describe('logout()', () => {
		it('should successfully logout a user', async () => {
			mockCommonService.findByEmail.mockResolvedValue(loggedInUserEntity);

			await authService.logout(accessTokenPayload);
			expect(mockCommonService.findByEmail).toBeCalledWith(accessTokenPayload.email);
			expect(mockUserRepository.save).toBeCalledWith(loggedInUserEntity);
		});

		it('should return an error since it could not find user', async () => {
			mockCommonService.findByEmail.mockRejectedValue(new Error('Could not find user with email wrong@email.com'));
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

	describe('validateUser()', () => {
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
	});
});