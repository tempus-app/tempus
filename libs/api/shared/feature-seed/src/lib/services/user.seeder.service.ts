import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@tempus/api/shared/entity';
import { Repository } from 'typeorm';
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import { UserService } from '@tempus/onboarding-api/feature-account';
import { RoleType } from '@tempus/shared-domain';
import { CreateUserDto } from '@tempus/api/shared/dto';

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
	) {}

	/**
	 * drops all entities in the user repository
	 */
	async clear() {
		await this.userRepository.clear();
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
}
