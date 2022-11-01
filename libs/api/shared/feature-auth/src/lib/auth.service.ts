import { ForbiddenException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { TokensDto, User, JwtPayload, JwtRefreshPayloadWithToken, AuthDto } from '@tempus/shared-domain';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@tempus/api/shared/entity';
import { ConfigService } from '@nestjs/config';
import { CommonService } from '@tempus/api/shared/feature-common';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);

	constructor(
		private jwtService: JwtService,
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		private configService: ConfigService,
		private commonService: CommonService,
	) {}

	async login(user: User): Promise<AuthDto> {
		const tokens = await this.createTokens(user);
		await this.updateRefreshTokenHash(user, tokens.refreshToken);
		const partialUser: UserEntity = { ...user };
		partialUser.password = null;
		partialUser.refreshToken = null;
		const result = new AuthDto(partialUser, tokens.accessToken, tokens.refreshToken);
		this.logger.log(`${partialUser.email} logged in as ${partialUser.roles}`);
		return result;
	}

	async logout(token: JwtPayload) {
		const user = await this.commonService.findByEmail(token.email);
		await this.updateRefreshTokenHash(user, null);
		this.logger.log(`${user.email} logged out`);
	}

	async refreshToken(payload: JwtRefreshPayloadWithToken) {
		const user = await this.commonService.findByEmail(payload.email);
		if (!user.refreshToken) {
			throw new ForbiddenException('User not logged in');
		}
		if (AuthService.compareData(payload.refreshToken, user.refreshToken)) {
			const tokens = await this.createTokens(user);
			await this.updateRefreshTokenHash(user, tokens.refreshToken);
			return tokens;
		}
		throw new ForbiddenException('Access Denied');
	}

	async validateUser(email: string, password: string): Promise<User> {
		const user = await this.commonService.findByEmail(email);
		if (user && (await AuthService.compareData(password, user.password))) {
			return user;
		}
		return null;
	}

	private static compareData(data: string, hashedData: string): boolean {
		try {
			return compare(data, hashedData);
		} catch (e) {
			throw new InternalServerErrorException(e);
		}
	}

	private async updateRefreshTokenHash(user: User, refreshToken: string) {
		const tokenOwner = user;
		const salt = await genSalt(this.configService.get('saltSecret'));

		// logging user out by setting their refreshToken to null
		if (!refreshToken) {
			tokenOwner.refreshToken = null;
		} else {
			const hashedRefreshToken = await hash(refreshToken, salt);
			tokenOwner.refreshToken = hashedRefreshToken;
		}
		await this.userRepository.save(tokenOwner);
	}

	private async createTokens(user: User): Promise<TokensDto> {
		const accessToken = await this.jwtService.signAsync(
			{
				email: user.email,
				roles: user.roles,
			},
			{
				secret: this.configService.get('jwtAccessSecret'),
				expiresIn: 60 * 15,
			},
		);
		const refreshToken = await this.jwtService.signAsync(
			{
				email: user.email,
			},
			{
				secret: this.configService.get('jwtRefreshSecret'),
				expiresIn: 60 * 120,
			},
		);
		const tokens = new TokensDto(accessToken, refreshToken);
		return tokens;
	}
}
