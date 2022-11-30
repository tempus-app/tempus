import { Resource, RoleType, User } from '@tempus/shared-domain';
import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { genSalt, hash } from 'bcrypt';
import { UserEntity } from '@tempus/api/shared/entity';
import { CreateUserDto, JwtPayload, UpdateUserDto, UserBasicDto } from '@tempus/api/shared/dto';
import { CommonService } from '@tempus/api/shared/feature-common';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		private configService: ConfigService,
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

	async getAdminMatchingFilter(filter: string): Promise<UserEntity[]> {
		const adminMatchingFilter = await this.userRepository
			.createQueryBuilder('admin')
			.where({ query: `%${filter}%` })
			.getMany();
		return adminMatchingFilter;
	}

	// TODO: filtering
	async getAllUsers(): Promise<User[]> {
		const users = await this.userRepository.find();

		return users;
	}

	async getAllAdmin(
		page: number,
		pageSize: number,
		filter: string,
	): Promise<{ userData: UserBasicDto[]; totalItems: number }> {
		// eslint-disable-next-line no-console
		console.log(filter);

		let usersAndCount: [UserEntity[], number] = [[], 0];

		usersAndCount = await this.userRepository.findAndCount({
			take: Number(pageSize),
			skip: Number(page) * Number(pageSize),
			where: [{ roles: RoleType.SUPERVISOR }, { roles: RoleType.BUSINESS_OWNER }],
		});

		const users = usersAndCount[0];
		const countOfItems = usersAndCount[1];

		const userInfo: Array<UserBasicDto> = users.map(res => {
			return new UserBasicDto(res.id, res.firstName, res.lastName, res.email, res.roles);
		});

		return { userData: userInfo, totalItems: countOfItems };
	}

	async deleteUser(userId: number): Promise<void> {
		const userEntity = await this.userRepository.findOne(userId);
		if (userEntity === undefined) {
			throw new NotFoundException(`Could not find user with id ${userId}`);
		}
		await this.userRepository.remove(userEntity);
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
