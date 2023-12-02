import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceEntity, UserEntity } from '@tempus/api/shared/entity';
import { Repository } from 'typeorm';
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import { UserService } from '@tempus/onboarding-api/feature-account';
import { RoleType } from '@tempus/shared-domain';
import { CreateUserDto } from '@tempus/api/shared/dto';
import * as bcrypt from 'bcrypt';

const saltRounds = 10;
@Injectable()
export class UserSeederService {
	/**
	 * Seeds the user database with test data
	 * @param userRepository user database repository
	 */
	constructor(
		private userService: UserService,
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		@InjectRepository(ResourceEntity) // Correctly inject the ResourceEntity repository
		private resourceRepository: Repository<ResourceEntity>,
	) {}

	/**
	 * drops all entities in the user repository
	 */
	async clear() {
		await this.userRepository.clear();
	}

	async getHashedPassword(userId: number): Promise<string> {
		const user = await this.userRepository.findOne({ where: { id: userId } });
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return user.password;
	}

	async getClients(): Promise<UserEntity[]> {
		

		const users = await this.userService.getAllUsers();

		// Not optimal lol but works
		const clients = users.filter(user => user.roles.includes(RoleType.CLIENT));

		return clients;
	}

	/**
	 * seeds business owners
	 * @param count number of business owners to create
	 * @returns array of created business owners
	 */
	async seedBusinessOwner(count = 2) {
		const createdUsers: UserEntity[] = [];
		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < count; i++) {
			const lastName = faker.name.lastName();
			const firstName = faker.name.firstName();

			const password = faker.internet.password();
			const user: CreateUserDto = new CreateUserDto(
				firstName,
				lastName,
				faker.internet.email(firstName, lastName),
				password,
				[RoleType.BUSINESS_OWNER],
			);
			const createdUser = await this.userService.createUser(user);
			createdUsers.push({ ...createdUser, password });
		}
		return createdUsers;
	}

	/**
	 * seeds supervisors
	 * @param count number of supervisors to create
	 * @returns array of created supervisors
	 */
	async seedSupervisor(count = 2) {
		const createdUsers: UserEntity[] = [];
		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < count; i++) {
			const lastName = faker.name.lastName();
			const firstName = faker.name.firstName();

			const password = faker.internet.password();
			const user: CreateUserDto = new CreateUserDto(
				firstName,
				lastName,
				faker.internet.email(firstName, lastName),
				password,
				[RoleType.SUPERVISOR],
			);
			const createdUser = await this.userService.createUser(user);
			createdUsers.push({ ...createdUser, password });
		}
		return createdUsers;
	}

	

	// user.seeder.service.ts// Add this method to seed clients
	async seedClients(clientCount: number): Promise<UserEntity[]> {
		const createdClients: UserEntity[] = [];
		for (let i = 0; i < clientCount; i++) {
			const lastName = faker.name.lastName();
			const firstName = faker.name.firstName();
			const plainPassword = faker.internet.password();
			const email = faker.internet.email(firstName, lastName);

			const userDto: CreateUserDto = new CreateUserDto(firstName, lastName, email, plainPassword, [
				RoleType.CLIENT,
			]);

			const createdUser = await this.userService.createUser(userDto);
			// const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
			// createdUser.password = hashedPassword;

			// // Create a ResourceEntity for the client
			// const resourceEntity = new ResourceEntity();
			// resourceEntity.id = createdUser.id; // Use the same ID as UserEntity
			// resourceEntity.email = email;
			// resourceEntity.password = hashedPassword; // Ensure the password is hashed if necessary
			// resourceEntity.roles = [RoleType.CLIENT];
			// Set other ResourceEntity properties as needed
			// ...

			// Save the ResourceEntity
			// await this.resourceRepository.save(resourceEntity);

			createdClients.push({ ...createdUser, password: plainPassword });
		}
		return createdClients;
	}
}
