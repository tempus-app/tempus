import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleType } from '@tempus/shared-domain';
import { PdfGeneratorService } from '@tempus/api/shared/feature-pdfgenerator';
import { ResourceEntity, UserEntity } from '@tempus/api/shared/entity';

@Injectable()
export class AppService {
	constructor(
		@InjectRepository(ResourceEntity) private resourceRepo: Repository<ResourceEntity>,
		private pdfGeneratorService: PdfGeneratorService,
		@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
	) {}

	getData() {
		return { message: 'Welcome to api!' };
	}

	createUser() {
		const newUser = new UserEntity();
		newUser.firstName = 'testF';
		newUser.lastName = 'testL';
		newUser.email = 'email@email.com';
		newUser.password = 'fred';
		const roles = [RoleType.BUSINESS_OWNER];
		newUser.roles = roles;
		this.userRepo.save(newUser);

		const newResource = new ResourceEntity();
		newResource.email = 'email';
		const resRoles = [RoleType.AVAILABLE_RESOURCE, RoleType.SUPERVISOR];
		newResource.roles = resRoles;

		this.resourceRepo.save(newResource);
	}

	async getUser() {
		const users = await this.resourceRepo.find();
		const usersRoles = [];
		users.forEach(user => {
			usersRoles.push(user.roles);
		});
		return { data: users, roles: usersRoles };
	}

	getPdf(res: Response) {
		this.pdfGeneratorService.createPDF(res);
	}
}
