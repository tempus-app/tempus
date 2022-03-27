import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceEntity, UserEntity } from '@tempus/api/shared/entity';
import { Resource, RoleType, User } from '@tempus/shared-domain';
import { Repository } from 'typeorm';

@Injectable()
export class CommonService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		@InjectRepository(ResourceEntity)
		private resourceRepository: Repository<ResourceEntity>,
	) {}

	async findByEmail(email: string): Promise<User | Resource> {
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

	async findById(userId: number): Promise<User | Resource> {
		const userEntity = await this.userRepository.findOne(userId);
		if (!userEntity) {
			throw new NotFoundException(`Could not find user with id ${userId}`);
		}
		if (userEntity.roles.includes(RoleType.BUSINESS_OWNER)) {
			return userEntity;
		}

		const resourceEntity = await this.resourceRepository.findOne(userId);
		if (!resourceEntity) {
			throw new NotFoundException(`Could not find resource with id ${userId}`);
		}
		return resourceEntity;
	}
}
