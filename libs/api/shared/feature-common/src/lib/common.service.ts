import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceEntity, UserEntity, ViewEntity } from '@tempus/api/shared/entity';
import { Resource, RoleType, User } from '@tempus/shared-domain';
import { Repository } from 'typeorm';

@Injectable()
export class CommonService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		@InjectRepository(ResourceEntity)
		private resourceRepository: Repository<ResourceEntity>,
		@InjectRepository(ViewEntity)
		private viewsRepository: Repository<ViewEntity>,
	) {}

	async findByEmail(email: string): Promise<User | Resource> {
		const user = (
			await this.userRepository.find({
				where: { email },
			})
		)[0];
		if (user === undefined) {
			throw new NotFoundException(`Could not find user with email ${email}`);
		}
		if (user.roles.includes(RoleType.BUSINESS_OWNER) || user.roles.includes(RoleType.SUPERVISOR)) {
			return user;
		}
		const resourceEntity = (
			await this.resourceRepository.find({
				where: { email },
				relations: [
					'location',
					'projectResources',
					'projectResources.project',
					'projectResources.resource',
					'views',
					'experiences',
					'educations',
					'skills',
					'certifications',
				],
			})
		)[0];
		if (!resourceEntity) {
			throw new NotFoundException(`Could not find resource with email ${email}`);
		}
		return resourceEntity;
	}

	async findById(id: number): Promise<User | Resource> {
		const userEntity = await this.userRepository.findOne(id);
		if (!userEntity) {
			throw new NotFoundException(`Could not find user with id ${id}`);
		}
		if (userEntity.roles.includes(RoleType.BUSINESS_OWNER) || userEntity.roles.includes(RoleType.SUPERVISOR)) {
			return userEntity;
		}

		const resourceEntity = await this.resourceRepository.findOne(id);
		if (!resourceEntity) {
			throw new NotFoundException(`Could not find resource with id ${id}`);
		}
		return resourceEntity;
	}

	async findUserByViewId(viewId: number): Promise<User | Resource> {
		const viewEntity = await this.viewsRepository.findOne({
			relations: ['resource', 'experiences', 'educations', 'skills', 'certifications'],
			where: {
				id: viewId,
			},
		});
		if (!viewEntity) {
			throw new NotFoundException(`Could not find view with id ${viewId}`);
		}

		const resourceEntity = await this.findById(viewEntity.resource.id);
		return resourceEntity;
	}
}
