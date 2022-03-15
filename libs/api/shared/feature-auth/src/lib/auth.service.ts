import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Tokens, RoleType, User, JwtPayload, JwtRefreshPayloadWithToken, AuthDto } from '@tempus/shared-domain';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceEntity, UserEntity } from '@tempus/api/shared/entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		@InjectRepository(ResourceEntity)
		private resourceRepository: Repository<ResourceEntity>,
		private configService: ConfigService,
	) {}

	async login(user: User): Promise<AuthDto> {
		const tokens = await this.createTokens(user);
		await this.updateRefreshTokenHash(user, tokens.refreshToken);
		const result = new AuthDto(user, tokens.accessToken, tokens.refreshToken);
		return result;
	}

	async logout(token: JwtPayload) {
		const user = await this.findByEmail(token.email);
		await this.updateRefreshTokenHash(user, null);
	}

	async refreshToken(payload: JwtRefreshPayloadWithToken) {
		const user = await this.findByEmail(payload.email);
		if (!user.refreshToken) {
			throw new ForbiddenException('User not logged in');
		}
		if (await AuthService.compareData(payload.refreshToken, user.refreshToken)) {
			const tokens = await this.createTokens(user);
			await this.updateRefreshTokenHash(user, tokens.refreshToken);
			return tokens;
		}
		throw new ForbiddenException('Access Denied');
	}

	async validateUser(email: string, password: string): Promise<User> {
		const user = await this.findByEmail(email);
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

	private async findByEmail(email: string): Promise<User> {
		const user = (
			await this.userRepository.find({
				where: { email },
			})
		)[0];
		if (!user) {
			throw new NotFoundException(`Could not find user with email ${email}`);
		}
		if (user.roles.includes(RoleType.BUSINESS_OWNER)) {
			return user;
		}
		const resourceEntity = (
			await this.resourceRepository.find({
				where: { email },
				relations: ['location', 'projects', 'views', 'experiences', 'educations', 'skills', 'certifications'],
			})
		)[0];
		if (!resourceEntity) {
			throw new NotFoundException(`Could not find resource with email ${email}`);
		}
		return resourceEntity;
	}

	private async updateRefreshTokenHash(user: User, refreshToken: string) {
		const tokenOwner = user;
		const salt = await genSalt(this.configService.get('saltSecret'));

		if (!refreshToken) {
			tokenOwner.refreshToken = refreshToken;
		} else {
			const hashedRefreshToken = await hash(refreshToken, salt);
			tokenOwner.refreshToken = hashedRefreshToken;
		}
		await this.userRepository.save(tokenOwner);
	}

	private async createTokens(user: User): Promise<Tokens> {
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
				expiresIn: 60 * 15,
			},
		);
		const tokens = new Tokens(accessToken, refreshToken);
		return tokens;
	}
}
