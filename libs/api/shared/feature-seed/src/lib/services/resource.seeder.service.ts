import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
	CertificationEntity,
	EducationEntity,
	ExperienceEntity,
	LocationEntity,
	ResourceEntity,
	SkillEntity,
	SkillTypeEntity,
	ViewEntity,
} from '@tempus/api/shared/entity';
import { Repository } from 'typeorm';
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import { ResourceService, UserService } from '@tempus/onboarding-api/feature-account';
import { Link, Resource, RoleType } from '@tempus/shared-domain';
import {
	CreateCertificationDto,
	CreateEducationDto,
	CreateExperienceDto,
	CreateLocationDto,
	CreateResourceDto,
	CreateSkillDto,
	CreateSkillTypeDto,
} from '@tempus/api/shared/dto';

@Injectable()
export class ResourceSeederService {
	/**
	 * Seeds the user database with test data
	 * @param resourceRepository user database repository
	 */
	constructor(
		private userService: UserService,
		@InjectRepository(ResourceEntity)
		private resourceRepository: Repository<ResourceEntity>,
		@InjectRepository(LocationEntity)
		private locationRepository: Repository<LocationEntity>,
		@InjectRepository(SkillEntity)
		private skillRepository: Repository<SkillEntity>,
		@InjectRepository(SkillTypeEntity)
		private skillTypeRepository: Repository<SkillTypeEntity>,
		@InjectRepository(ViewEntity)
		private viewRepository: Repository<ViewEntity>,
		@InjectRepository(EducationEntity)
		private educationRepository: Repository<EducationEntity>,
		@InjectRepository(ExperienceEntity)
		private experienceRepository: Repository<ExperienceEntity>,
		@InjectRepository(CertificationEntity)
		private certificationRepository: Repository<CertificationEntity>,

		private resourceService: ResourceService,
	) {}

	/**
	 * drops all entities in the user repository
	 */
	async clear() {
		await this.skillRepository.query('DELETE FROM skill_entity CASCADE');
		await this.skillTypeRepository.query('DELETE FROM skill_type_entity CASCADE');
		await this.resourceRepository.query('DELETE FROM user_entity CASCADE');
		await this.educationRepository.query('DELETE FROM education_entity CASCADE');
		await this.experienceRepository.query('DELETE FROM experience_entity CASCADE');
		await this.certificationRepository.query('DELETE FROM certification_entity CASCADE');

		await this.locationRepository.query('DELETE FROM location_entity CASCADE');
		await this.viewRepository.query('DELETE FROM view_entity CASCADE');
	}

	/**
	 * creates random location
	 * @returns locationEntity
	 */
	private static createLocation() {
		return new CreateLocationDto(faker.address.city(), faker.address.state(), 'United States');
	}

	private static generateDateRange() {
		const startDate = faker.date.past();
		return {
			startDate,
			endDate: faker.date.between(startDate, Date.now()),
		};
	}

	private static createEducation() {
		const educations: CreateEducationDto[] = [];

		const educationNum = Math.floor(Math.random() * 3) + 1;

		for (let i = 0; i < educationNum; i++) {
			const date = ResourceSeederService.generateDateRange();

			educations.push(
				new CreateEducationDto(
					faker.name.jobArea(),
					faker.company.companyName(),
					date.startDate,
					date.endDate,
					ResourceSeederService.createLocation(),
				),
			);
		}

		return educations;
	}

	private static generateParagraph() {
		const parapgraph: string[] = [];
		const setences = Math.floor(Math.random() * 6) + 1;

		for (let i = 0; i < setences; i++) {
			parapgraph.push(faker.lorem.sentence());
		}
		return parapgraph;
	}

	private static createCertifications() {
		const certifications: CreateCertificationDto[] = [];

		const certificationNum = Math.floor(Math.random() * 4) + 1;
		for (let i = 0; i < certificationNum; i++) {
			certifications.push(
				new CreateCertificationDto(faker.name.jobType(), faker.company.companyName(), faker.lorem.sentences(3)),
			);
		}
		return certifications;
	}

	private static createExperience() {
		const date = ResourceSeederService.generateDateRange();

		const experiences: CreateExperienceDto[] = [];

		const experienceNum = Math.floor(Math.random() * 4) + 1;
		for (let i = 0; i < experienceNum; i++) {
			experiences.push(
				new CreateExperienceDto(
					faker.name.jobTitle(),
					faker.lorem.sentences(3),
					ResourceSeederService.generateParagraph(),
					faker.company.companyName(),
					date.startDate,
					date.endDate,
					ResourceSeederService.createLocation(),
				),
			);
		}
		return experiences;
	}

	private static generateSkills() {
		const skills: CreateSkillDto[] = [];
		for (let i = 0; i < 5; i++) {
			skills.push(new CreateSkillDto(new CreateSkillTypeDto(faker.word.adjective())));
		}
		return skills;
	}

	/* async seedAvailableResources(count = 5) {
		const createdResources: ResourceEntity[] = [];
		for (let i = 0; i < count; i++) {
			const resource: ResourceEntity = {
				...ResourceSeederService.createResource(),
				roles: [RoleType.AVAILABLE_RESOURCE],
			};
			const { password } = resource;
			const modifiedResource = {
				...resource,
				password: await this.userService.hashPassword(password),
				views: [ResourceSeederService.generateView(resource)],
			};
			const createdUser = await this.resourceRepository.save(modifiedResource);
			createdResources.push({ ...createdUser, password });
		}
		return createdResources;
	}


	
	async seedAssignedResources(projects: ProjectEntity[], count = 5) {
		const createdResources: ResourceEntity[] = [];
		for (let i = 0; i < count; i++) {
			const resource = ResourceSeederService.createResource(RoleType.ASSIGNED_RESOURCE);
			const { password } = resource;
			// sorts projects
			projects.sort(() => {
				return 0.5 - Math.random();
			});

			const createdView = await this.viewRepository.save(ResourceSeederService.generateView(resource));

			const modifiedResource: ResourceEntity = {
				...resource,
				roles: [RoleType.ASSIGNED_RESOURCE],
				password: await this.userService.hashPassword(password),
				views: [createdView],
				projects: projects.slice(Math.floor(Math.random() * projects.length)), // assigns a random number of projects
			};
			const createdUser = await this.resourceRepository.save(modifiedResource);
			createdResources.push({ ...createdUser, password });
		}
		return createdResources;
	} */
	static createResource(role: RoleType) {
		const firstName = faker.name.firstName();
		const lastName = faker.name.lastName();
		const password = faker.internet.password();

		const resource: CreateResourceDto = new CreateResourceDto(
			firstName,
			lastName,
			faker.internet.email(firstName, lastName),
			password,
			[role],
			faker.phone.phoneNumber(),
			faker.name.jobTitle(),
			faker.internet.url(),
			faker.internet.url(),
			faker.internet.url(),
			ResourceSeederService.createLocation(),
			ResourceSeederService.createExperience(),
			ResourceSeederService.createEducation(),
			ResourceSeederService.generateSkills(),
			ResourceSeederService.createCertifications(),
			faker.lorem.sentences(3),
			faker.lorem.sentences(3),
			faker.lorem.sentences(3),
			faker.lorem.sentences(3),
		);
		return resource;
	}

	async seedResources(links: Link[]) {
		const createdResources: Resource[] = [];

		for (let i = 0; i < links.length; i++) {
			const resource = ResourceSeederService.createResource(RoleType.AVAILABLE_RESOURCE);
			const { password } = resource;
			resource.linkId = links[i].id;

			const createdUser = await this.resourceService.createResource(resource);
			createdResources.push({ ...createdUser, password });
		}

		return createdResources;
	}
}
