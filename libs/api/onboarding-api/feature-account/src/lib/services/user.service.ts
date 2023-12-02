import { Client, Project, Resource, RoleType, User } from '@tempus/shared-domain';
import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Any, getManager, In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { hash, genSalt } from 'bcrypt';
import { ClientEntity, ProjectResourceEntity, ResourceEntity, UserEntity } from '@tempus/api/shared/entity';
import { CreateUserDto, JwtPayload, UpdateUserDto } from '@tempus/api/shared/dto';
import { CommonService } from '@tempus/api/shared/feature-common';
import { EmailService } from '@tempus/api/shared/feature-email';
import { ResourceService } from './resource.service';

const saltRounds = 10;
@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		@InjectRepository(ResourceEntity)
		private resourceRepository: Repository<ResourceEntity>,
		@InjectRepository(ProjectResourceEntity)
		private projectResourceRepository: Repository<ProjectResourceEntity>,
		@InjectRepository(ClientEntity)
		private clientRepository: Repository<ClientEntity>,
		private resourceService: ResourceService,
		private configService: ConfigService,
		private emailService: EmailService,
		private commonService: CommonService,
	) {}

	async createUser(user: CreateUserDto): Promise<User> {
		const userEntity = UserEntity.fromDto(user);
		userEntity.password = await bcrypt.hash(userEntity.password, saltRounds);
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

	async getAllSupervisors(): Promise<User[]> {

		const users = await this.getAllUsers();

		// Not optimal lol but works
		const supervisors = users.filter(user =>
       	 user.roles.includes(RoleType.SUPERVISOR) || user.roles.includes(RoleType.BUSINESS_OWNER)
    	);

		// IDK WHY THIS ISNT WORKING
		/*const supervisors = await this.userRepository.find({
			where: {
				roles: Any([RoleType.SUPERVISOR] as any[]),
			},
		  });**/


		return supervisors;
	}

	async getSupervisorProjects(supervisorId: number):Promise<Project[]> {

		const resources = await this.getSupervisorResources(supervisorId);

		const resourceIds = resources.map(resource => resource.id);

		const projectResources = await this.projectResourceRepository.find({
			where: { resource: In(resourceIds)},
			relations: ['project', 'resource'],
		});
		if (projectResources.length === 0) {
			throw new NotFoundException(
				`Could not find projects for resource with id ${supervisorId}`,
			);
		}
		const projects = Array.from(new Set(projectResources.map(projRes => projRes.project)));

		const projectsNoDuplicates = projects.filter((obj, index, self) => index === self.findIndex((el) => el['id'] === obj['id']));

		return projectsNoDuplicates;
	}

	async getSupervisorResources(supervisorId: number):Promise<Resource[]> {
		
		const resources = await this.resourceRepository.find({
			where: {supervisorId: supervisorId}
		})

		return resources;
	}

	async getSupervisorClients(supervisorId: number): Promise<Client[]>{

		const resources = await this.getSupervisorResources(supervisorId);

		const resourceIds = resources.map(resource => resource.id);

		const projectResources = await this.projectResourceRepository.find({
			where: { resource: In(resourceIds)},
			relations: ['project', 'project.client', 'resource'],
		});
		if (projectResources.length === 0) {
			throw new NotFoundException(
				`Could not find projects for resource with id ${supervisorId}`,
			);
		}
		const clients = Array.from(new Set(projectResources.map(projRes => projRes.project.client)));

		const clientsNoDuplicates = clients.filter((obj, index, self) => index === self.findIndex((el) => el['id'] === obj['id']));

		return clientsNoDuplicates;

	}

	async getClientProjects(clientId: number):Promise<Project[]> {
		
		const clientEntity = await this.clientRepository.findOne(clientId, {
			relations: ['projects'],
		});
		if (!clientEntity) {
			throw new NotFoundException(`Could not find client with id ${clientId}`);
		}

		return clientEntity.projects;
	}

	async getClientResources(clientId: number):Promise<Resource[]> {
		
		const projects = await this.getClientProjects(clientId);

		const projectIds = projects.map(project => project.id);


		const projectResources = await this.projectResourceRepository.find({
			where: { project: In(projectIds)},
			relations: ['project', 'resource'],
		});
		const resources = Array.from(new Set(projectResources.map(projRes => projRes.resource)));
		return resources;
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

	async findByEmail(email: string): Promise<UserEntity | undefined> {
		return this.userRepository.findOne({ where: { email } });
	}
}
