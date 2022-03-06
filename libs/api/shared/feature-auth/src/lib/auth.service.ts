import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AuthDto, ResourceEntity, RoleType, User, UserEntity } from '@tempus/shared-domain';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		@InjectRepository(ResourceEntity)
		private resourceRepository: Repository<ResourceEntity>,
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

	async login(user: User): Promise<AuthDto> {
		const partialUser = user;
		const payload = {
			email: partialUser.email,
			roles: partialUser.roles,
		};
		partialUser.password = null;
		const accessToken = this.jwtService.sign(payload);
		const result = new AuthDto(partialUser, accessToken);

		return result;
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
}
