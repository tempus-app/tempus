import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@tempus/api/shared/entity';
import { Repository } from 'typeorm';
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import { UserService } from '@tempus/onboarding-api/feature-account';
import { RoleType } from '@tempus/shared-domain';

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
		this.userRepository.clear();
	}

	async seedBusinessOwner(count = 2) {
		const createdUsers: UserEntity[] = [];
		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < count; i++) {
			const { name } = faker;
			const password = faker.internet.password();
			const user: UserEntity = new UserEntity(
				null,
				name.firstName(),
				name.lastName(),
				null,
				await this.userService.hashPassword(password),
				[RoleType.BUSINESS_OWNER],
			);
			user.email = faker.internet.email(user.firstName, user.lastName);
			const createdUser = await this.userRepository.save(user);
			createdUsers.push({ ...createdUser, password });
		}
		return createdUsers;
	}
}
