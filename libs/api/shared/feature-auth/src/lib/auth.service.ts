import { Inject, Injectable, InternalServerErrorException, NotFoundException, Scope } from '@nestjs/common';
import { Tokens, RoleType, User } from '@tempus/shared-domain';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
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

	async validateUser(email: string, password: string): Promise<User> {
		const user = await this.findByEmail(email);
		if (user && (await AuthService.comparePassword(password, user.password))) {
			return user;
		}
		return null;
	}

	async getUserFromJWT(email: string) {
		const user = await this.findByEmail(email);
		if (user) {
			return user;
		}
		return null;
	}

	async login(user: User): Promise<Tokens> {
		const tokens = this.createTokens(user);

		return tokens;
	}

	private static comparePassword(password: string, encryptedPassword: string): boolean {
		try {
			return compare(password, encryptedPassword);
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
