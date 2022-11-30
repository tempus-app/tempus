import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
	CertificationEntity,
	EducationEntity,
	ExperienceEntity,
	LocationEntity,
	ResourceEntity,
	RevisionEntity,
	SkillEntity,
	SkillTypeEntity,
	ViewEntity,
} from '@tempus/api/shared/entity';
import { Repository } from 'typeorm';
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import { ResourceService } from '@tempus/onboarding-api/feature-account';
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
	 * seeds resources and resource profiles
	 * @param resourceRepository
	 * @param locationRepository
	 * @param skillRepository
	 * @param skillTypeRepository
	 * @param viewRepository
	 * @param educationRepository
	 * @param experienceRepository
	 * @param certificationRepository
	 * @param resourceService
	 */
	constructor(
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
		@InjectRepository(RevisionEntity)
		private revisionRepository: Repository<RevisionEntity>,

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
		await this.revisionRepository.query('DELETE FROM revision_entity CASCADE');
	}

	/**
	 * creates new locationDto with random values
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

	/**
	 * creates a new educationDto with random values
	 * @returns CreateEducationDto
	 */
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

	/**
	 * generates random sequence of sentences
	 * @returns string[]
	 */
	private static generateParagraph() {
		const paragraph: string[] = [];
		const setences = Math.floor(Math.random() * 6) + 1;

		for (let i = 0; i < setences * 2; i++) {
			paragraph.push(faker.lorem.sentence());
		}
		return paragraph;
	}

	/**
	 * creates new certificationDto with random values
	 * @returns CreateCertificationDto
	 */
	private static createCertifications() {
		const certifications: CreateCertificationDto[] = [];

		const certificationNum = Math.floor(Math.random() * 4) + 1;
		for (let i = 0; i < certificationNum; i++) {
			certifications.push(
				new CreateCertificationDto(faker.name.jobType(), faker.company.companyName(), faker.lorem.sentences(7)),
			);
		}
		return certifications;
	}

	/**
	 * creates new experienceDto with random values
	 * @returns CreateEducationDto
	 */
	private static createExperience() {
		const date = ResourceSeederService.generateDateRange();

		const experiences: CreateExperienceDto[] = [];

		const experienceNum = Math.floor(Math.random() * 4) + 1;
		for (let i = 0; i < experienceNum; i++) {
			experiences.push(
				new CreateExperienceDto(
					faker.name.jobTitle(),
					faker.lorem.sentences(7, ',').split(','),
					faker.company.companyName(),
					date.startDate,
					date.endDate,
					ResourceSeederService.createLocation(),
				),
			);
		}
		return experiences;
	}

	/**
	 * generates skill Dto with random values
	 * @returns SkillDto
	 */
	private static generateSkills() {
		const skills: CreateSkillDto[] = [];
		for (let i = 0; i < 5; i++) {
			skills.push(new CreateSkillDto(new CreateSkillTypeDto(faker.word.adjective())));
		}
		return skills;
	}

	/**
	 * creates a new resourceEntity with random values
	 * @param role roletype of resource
	 * @returns resourceDto entity
	 */
	static createResource(role: RoleType, linkId: number) {
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
			undefined,
			faker.name.jobTitle(),
			faker.internet.url(),
			faker.internet.url(),
			faker.internet.url(),
			ResourceSeederService.createLocation(),
			ResourceSeederService.createExperience(),
			ResourceSeederService.createEducation(),
			ResourceSeederService.generateSkills(),
			ResourceSeederService.createCertifications(),
			faker.lorem.sentences(7),
			faker.lorem.sentences(7),
			faker.lorem.sentences(7),
			faker.lorem.sentences(7),
			linkId,
		);
		return resource;
	}

	/**
	 * seed resources with random values
	 * @param links links to associate with resource
	 * @returns returns array of seeded resources
	 */
	async seedResources(links: Link[]): Promise<Resource[]> {
		const createdResources: Resource[] = [];

		for (let i = 0; i < links.length; i++) {
			const resource = ResourceSeederService.createResource(RoleType.AVAILABLE_RESOURCE, links[i].id);
			const { password } = resource;

			const createdUser = await this.resourceService.createResource(resource);
			createdResources.push({ ...createdUser, password });
		}

		return createdResources;
	}
}
