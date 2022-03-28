import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, OneToOne } from 'typeorm';
import { View, ViewType } from '@tempus/shared-domain';
import { CreateViewDto } from '@tempus/api/shared/dto';
import { SkillEntity } from './skill.entity';
import { RevisionEntity } from './revision.entity';
import { ExperienceEntity } from './experience.entity';
import { CertificationEntity, EducationEntity } from '.';
import { ResourceEntity } from '../account-entities';

@Entity()
export class ViewEntity implements View {
	constructor(
		id?: number,
		profileSummary?: string,
		skillsSummary?: string,
		educationsSummary?: string,
		experiencesSummary?: string,
		type?: string,
		revision?: RevisionEntity,
		skills?: SkillEntity[],
		experiences?: ExperienceEntity[],
		educations?: EducationEntity[],
		certifications?: CertificationEntity[],
		resource?: ResourceEntity,
		viewType?: ViewType,
	) {
		this.id = id;
		this.profileSummary = profileSummary;
		this.skillsSummary = skillsSummary;
		this.educationsSummary = educationsSummary;
		this.experiencesSummary = experiencesSummary;
		this.type = type;
		this.revision = revision;
		this.skills = skills;
		this.experiences = experiences;
		this.educations = educations;
		this.certifications = certifications;
		this.resource = resource;
		this.viewType = viewType;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	profileSummary: string;

	@Column({ nullable: true })
	skillsSummary: string;

	@Column({ nullable: true })
	educationsSummary: string;

	@Column({ nullable: true })
	experiencesSummary: string;

	@Column()
	type: string;

	@OneToOne(() => RevisionEntity, revision => revision.view)
	revision: RevisionEntity;

	@ManyToMany(() => SkillEntity, { cascade: ['insert', 'update'] })
	@JoinTable()
	skills: SkillEntity[];

	@ManyToMany(() => ExperienceEntity, { cascade: ['insert', 'update'] })
	@JoinTable()
	experiences: ExperienceEntity[];

	@ManyToMany(() => EducationEntity, { cascade: ['insert', 'update'] })
	@JoinTable()
	educations: EducationEntity[];

	@ManyToMany(() => CertificationEntity, { cascade: ['insert', 'update'] })
	@JoinTable()
	certifications: CertificationEntity[];

	@ManyToOne(() => ResourceEntity, resource => resource.views, { onDelete: 'CASCADE' })
	resource: ResourceEntity;

	@Column({
		type: 'enum',
		enum: ViewType,
		default: ViewType.SECONDARY,
	})
	viewType: ViewType;

	public static fromDto(dto: CreateViewDto): ViewEntity {
		if (dto == null) return new ViewEntity();
		return new ViewEntity(
			undefined,
			dto.profileSummary,
			dto.skillsSummary,
			dto.educationsSummary,
			dto.experiencesSummary,
			dto.type,
			undefined,
			dto.skills.map(skill => SkillEntity.fromDto(skill)),
			dto.experiences.map(experience => ExperienceEntity.fromDto(experience)),
			dto.educations.map(education => EducationEntity.fromDto(education)),
			dto.certifications.map(certification => CertificationEntity.fromDto(certification)),
			undefined,
			dto.viewType,
		);
	}
}
