import { Resource, RoleType, User } from '@tempus/shared-domain';
import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { getManager, Repository } from 'typeorm';
import { genSalt, hash } from 'bcrypt';
import { UserEntity } from '@tempus/api/shared/entity';
import { CreateUserDto, JwtPayload, UpdateUserDto } from '@tempus/api/shared/dto';
import { CommonService } from '@tempus/api/shared/feature-common';
import { EmailService } from '@tempus/api/shared/feature-email';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		private configService: ConfigService,
		private emailService: EmailService,
		private commonService: CommonService,
	) {}

	async createUser(user: CreateUserDto): Promise<User> {
		const userEntity = UserEntity.fromDto(user);
		userEntity.password = await this.hashPassword(userEntity.password);
		if ((await this.userRepository.findOne({ email: userEntity.email })) !== undefined) {
			throw new ForbiddenException('Cannot create a user that already exists');
		}
		const createdUser = await this.userRepository.save(userEntity);
		createdUser.password = null;
		return createdUser;
	}

	async updateUser(updateUserData: UpdateUserDto): Promise<User> {
		const userEntity = await this.userRepository.findOne(updateUserData.id);
		if (userEntity === undefined) {
			throw new NotFoundException(`Could not find user with id ${updateUserData.id}`);
		}
		const user = UserEntity.fromDto(updateUserData);

		if (user.password) {
			user.password = await this.hashPassword(user.password);
		}
		Object.entries(user).forEach(entry => {
			if (!entry[1]) {
				delete user[entry[0]];
			}
		});

		Object.assign(userEntity, user);
		const updatedUser = await this.userRepository.save(userEntity);
		updatedUser.password = null;
		updatedUser.refreshToken = null;
		return updatedUser;
	}

	async getUser(token: JwtPayload): Promise<User | Resource> {
		const userEntity = await this.commonService.findByEmail(token.email);
		userEntity.password = null;
		userEntity.refreshToken = null;
		return userEntity;
	}

	async getUserbyId(id: number): Promise<User> {
		const userEntity = await this.userRepository.findOne(id);
		if (!userEntity) throw new NotFoundException(`Could not find user with id ${id}`);
		return userEntity;
	}

	// TODO: filtering
	async getAllUsers(): Promise<User[]> {
		const users = await this.userRepository.find();

		return users;
	}

	async deleteUser(token: JwtPayload, userId: number): Promise<void> {
		if (token.roles.includes(RoleType.SUPERVISOR) && !token.roles.includes(RoleType.BUSINESS_OWNER)) {
			throw new ForbiddenException('Forbidden. Supervisors cannot delete accounts');
		}
		const userEntity = await this.userRepository.findOne(userId);
		if (userEntity === undefined) {
			throw new NotFoundException(`Could not find user with id ${userId}`);
		}
		return getManager().transaction(async manager => {
			await manager.getRepository(UserEntity).remove(userEntity);
			try {
				await this.emailService.sendDeletedAccountEmail(userEntity);
			} catch (err) {
				throw new Error('Email unable to be sent.');
			}
		});
	}

	private async hashPassword(password: string): Promise<string> {
		try {
			const salt = await genSalt(this.configService.get('saltSecret'));
			return hash(password, salt);
		} catch (e) {
			throw new InternalServerErrorException(e);
		}
	}
}
