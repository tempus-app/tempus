import { Resource, RoleType, User, UserEntity, UpdateUserDto, CreateUserDto } from '@tempus/shared-domain';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { genSalt, hash } from 'bcrypt';
import { ResourceService } from './resource.service';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		private resourceService: ResourceService,
		private configService: ConfigService,
	) {}

	async createUser(user: CreateUserDto): Promise<User> {
		const userEntity = CreateUserDto.toEntity(user);
		userEntity.password = await this.hashPassword(userEntity.password);
		return this.userRepository.save(userEntity);
	}

	async updateUser(updateUserData: UpdateUserDto): Promise<User> {
		const userEntity = await this.userRepository.findOne(updateUserData.id);
		if (!userEntity) {
			throw new NotFoundException(`Could not find user with id ${userEntity.id}`);
		}
		const user = UpdateUserDto.toEntity(updateUserData);
		Object.entries(user).forEach(entry => {
			if (!entry[1]) {
				delete user[entry[0]];
			}
		});

		Object.assign(userEntity, user);
		return this.userRepository.save(userEntity);
	}

	async getUser(userId: number): Promise<User | Resource> {
		const userEntity = await this.userRepository.findOne(userId);
		if (!userEntity) {
			throw new NotFoundException(`Could not find user with id ${userEntity.id}`);
		}
		if (userEntity.roles.includes(RoleType.BUSINESS_OWNER)) {
			return userEntity;
		}
		const resourceDto = await this.resourceService.getResource(userId);
		return resourceDto;
	}

	// TODO: filtering
	// ROLES?
	// get by resource etc
	async getAllUsers(): Promise<User[]> {
		// location?: string[] | string,
		// skills?: string[] | string,
		// title?: string[] | string,
		// project?: string[] | string,
		// status?: string[] | string,
		// sortBy?: string,
		const users = await this.userRepository.find();

		return users;
	}

	async deleteUser(userId: number): Promise<void> {
		const userEntity = await this.userRepository.findOne(userId);
		if (!userEntity) {
			throw new NotFoundException(`Could not find user with id ${userId}`);
		}
		await this.userRepository.remove(userEntity);
	}

	private async hashPassword(password: string): Promise<string> {
		try {
			const salt = await genSalt(password, this.configService.get('saltSecret'));
			return await hash(password, salt);
		} catch (e) {
			throw new InternalServerErrorException(e);
		}
	}
}
