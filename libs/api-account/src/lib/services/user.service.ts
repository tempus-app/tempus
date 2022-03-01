import { Resource, RoleType, User, UserEntity, UpdateUserDto, CreateUserDto } from '@tempus/datalayer';
import { ConsoleLogger, Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResourceService } from './resource.service';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		private resourceService: ResourceService,
	) {}

	async createUser(user: CreateUserDto): Promise<User> {
		const userEntity = CreateUserDto.toEntity(user);
		return this.userRepository.save(userEntity);
	}

	async updateUser(updateUserData: UpdateUserDto): Promise<User> {
		const userEntity = await this.userRepository.findOne(updateUserData.id);
		if (!userEntity) {
			throw new NotFoundException(`Could not find user with id ${userEntity.id}`);
		}
		const user = UpdateUserDto.toEntity(updateUserData);
		for (const [key, val] of Object.entries(user)) if (!val) delete user[key];

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

	async findByEmail(email: string): Promise<User> {
		const user = (
			await this.userRepository.find({
				where: { email },
			})
		)[0];
		if (!user) {
			throw new NotFoundException(`Could not find resource with id ${email}`);
		}
		if (user.roles.includes(RoleType.BUSINESS_OWNER)) {
			return user;
		}
		const resource = await this.resourceService.findResourceByEmail(email);
		return resource;
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
}
