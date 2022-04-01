import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '@tempus/api/shared/entity';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CommonService } from '@tempus/api/shared/feature-common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { authDto, user } from './auth.mock';

const mockUserRepository = createMock<Repository<UserEntity>>();

const mockJwtService = {
	signAsync: jest.fn().mockResolvedValue('jwtToken'),
};

const mockCommonService = {
	findByEmail: jest.fn().mockResolvedValue(UserEntity),
};

const mockConfigService = {
	get: jest.fn().mockImplementation(param => {
		if (param === 'saltSecret') {
			return 10;
		}
		return 'secret';
	}),
};

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
			const res = await authService.login(user);
			expect(mockJwtService.signAsync).toHaveBeenNthCalledWith(
				1,
				{ email: 'johndoe@email.com', roles: null },
				{ expiresIn: 900, secret: 'secret' },
			);
			expect(mockJwtService.signAsync).toHaveBeenNthCalledWith(
				2,
				{ email: 'johndoe@email.com' },
				{ expiresIn: 900, secret: 'secret' },
			);
			expect(res).toEqual(authDto);
		});
	});
});
