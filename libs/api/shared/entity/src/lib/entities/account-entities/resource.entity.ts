import { CreateResourceDto } from '@tempus/api/shared/dto';
import { Resource, RoleType } from '@tempus/shared-domain';
import { ChildEntity, Column, OneToMany, OneToOne } from 'typeorm';
import { LocationEntity } from '../common-entities';
import { CertificationEntity, EducationEntity, ExperienceEntity, SkillEntity, ViewEntity } from '../profile-entities';
import { ProjectResourceEntity } from '../project-entities';
import { UserEntity } from './user.entity';
// import { TimesheetEntity } from '../timesheet-entities/timesheet.entity';

@ChildEntity()
export class ResourceEntity extends UserEntity implements Resource {
	constructor(
		id?: number,
		phoneNumber?: string,
		calEmail?: string,
		title?: string,
		linkedInLink?: string,
		githubLink?: string,
		otherLink?: string,
		location?: LocationEntity,
		projectResources?: ProjectResourceEntity[],
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
		resume?: Uint8Array,
		// timesheets?: TimesheetEntity[],
	) {
		super(id, firstName, lastName, email, password, roles);
		this.calEmail = calEmail;
		this.phoneNumber = phoneNumber;
		this.title = title;
		this.location = location;
		this.projectResources = projectResources;
		this.views = views;
		this.experiences = experiences;
		this.educations = educations;
		this.skills = skills;
		this.certifications = certifications;
		this.linkedInLink = linkedInLink;
		this.githubLink = githubLink;
		this.otherLink = otherLink;
		this.resume = resume;
		// this.timesheets = timesheets ?? [];
	}

	@Column({ nullable: true })
	phoneNumber: string;

	@Column({ nullable: true })
	calEmail: string;

	@Column({ nullable: true })
	linkedInLink: string;

	@Column({ nullable: true })
	githubLink: string;

	@Column({ nullable: true })
	otherLink: string;

	@Column({ nullable: true, type: 'bytea' })
	resume: Uint8Array;

	@Column({ nullable: true })
	title: string;

	@OneToOne(() => LocationEntity, loc => loc.resource, { cascade: ['insert', 'update'], nullable: true })
	location: LocationEntity;

	@OneToMany(() => ProjectResourceEntity, projectResources => projectResources.resource)
	projectResources: ProjectResourceEntity[];

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

	// @OneToMany(() => TimesheetEntity, timesheet => timesheet.resource, { cascade: ['insert', 'update'] })
	// timesheets: TimesheetEntity[];

	public static override fromDto(dto: CreateResourceDto): ResourceEntity {
		if (dto == null) return new ResourceEntity();
		return new ResourceEntity(
			undefined,
			dto.phoneNumber,
			dto.calEmail,
			dto.title,
			dto.linkedInLink,
			dto.githubLink,
			dto.otherLink,
			dto.location ? LocationEntity.fromDto(dto.location) : null,
			undefined,
			undefined,
			dto.experiences?.map(experience => ExperienceEntity.fromDto(experience)),
			dto.educations?.map(education => EducationEntity.fromDto(education)),
			dto.skills?.map(skill => SkillEntity.fromDto(skill)),
			dto.certifications?.map(certification => CertificationEntity.fromDto(certification)),
			dto.firstName,
			dto.lastName,
			dto.email,
			dto.password,
			dto.roles,
		);
	}
}
