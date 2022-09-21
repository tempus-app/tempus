import { CreateResourceDto } from '@tempus/api/shared/dto';
import { Resource, RoleType } from '@tempus/shared-domain';
import { ChildEntity, Column, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { LocationEntity } from '../common-entities';
import { CertificationEntity, EducationEntity, ExperienceEntity, SkillEntity, ViewEntity } from '../profile-entities';
import { ProjectEntity } from '../project-entities';
import { UserEntity } from './user.entity';

@ChildEntity()
export class ResourceEntity extends UserEntity implements Resource {
	constructor(
		id?: number,
		phoneNumber?: string,
		title?: string,
		linkedInLink?: string,
		githubLink?: string,
		otherLink?: string,
		location?: LocationEntity,
		projects?: ProjectEntity[],
		views?: ViewEntity[],
		experiences?: ExperienceEntity[],
		educations?: EducationEntity[],
		skills?: SkillEntity[],
		certifications?: CertificationEntity[],
		firstName?: string,
		lastName?: string,
		email?: string,
		password?: string,
		roles?: RoleType[],
	) {
		super(id, firstName, lastName, email, password, roles);
		this.phoneNumber = phoneNumber;
		this.title = title;
		this.location = location;
		this.projects = projects;
		this.views = views;
		this.experiences = experiences;
		this.educations = educations;
		this.skills = skills;
		this.certifications = certifications;
		this.linkedInLink = linkedInLink;
		this.githubLink = githubLink;
		this.otherLink = otherLink;
	}

	@Column({ nullable: true })
	phoneNumber: string;

	@Column({ nullable: true })
	linkedInLink: string;

	@Column({ nullable: true })
	githubLink: string;

	@Column({ nullable: true })
	otherLink: string;

	@Column({ nullable: true })
	title: string;

	@OneToOne(() => LocationEntity, loc => loc.resource, { cascade: ['insert', 'update'] })
	location: LocationEntity;

	@ManyToMany(() => ProjectEntity, projects => projects.resources, { cascade: ['insert', 'update'] })
	@JoinTable()
	projects: ProjectEntity[];

	@OneToMany(() => ViewEntity, views => views.resource, { cascade: ['insert', 'update'] })
	views: ViewEntity[];

	@OneToMany(() => ExperienceEntity, experience => experience.resource, { cascade: ['insert', 'update'] })
	experiences: ExperienceEntity[];

	@OneToMany(() => EducationEntity, education => education.resource, { cascade: ['insert', 'update'] })
	educations: EducationEntity[];

	@OneToMany(() => SkillEntity, skill => skill.resource, { cascade: ['insert', 'update'] })
	skills: SkillEntity[];

	@OneToMany(() => CertificationEntity, certification => certification.resource, { cascade: ['insert', 'update'] })
	certifications: CertificationEntity[];

	public static override fromDto(dto: CreateResourceDto): ResourceEntity {
		if (dto == null) return new ResourceEntity();
		return new ResourceEntity(
			undefined,
			dto.phoneNumber,
			dto.title,
			dto.linkedInLink,
			dto.githubLink,
			dto.otherLink,
			LocationEntity.fromDto(dto.location),
			undefined,
			undefined,
			dto.experiences.map(experience => ExperienceEntity.fromDto(experience)),
			dto.educations.map(education => EducationEntity.fromDto(education)),
			dto.skills.map(skill => SkillEntity.fromDto(skill)),
			dto.certifications.map(certification => CertificationEntity.fromDto(certification)),
			dto.firstName,
			dto.lastName,
			dto.email,
			dto.password,
			dto.roles,
		);
	}
}
