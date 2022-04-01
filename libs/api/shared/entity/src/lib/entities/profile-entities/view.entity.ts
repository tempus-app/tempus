import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, OneToOne } from 'typeorm';
import { RevisionType, RoleType, View, ViewType } from '@tempus/shared-domain';
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
		revisionType?: RevisionType,
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
		this.revisionType = revisionType;
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

	@Column()
	locked: boolean;

	@OneToOne(() => RevisionEntity, revision => revision.view)
	revision?: RevisionEntity;

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

	@Column({ nullable: true })
	lastUpdateDate?: Date;

	@Column({ name: 'created_at' })
	createdAt: Date;

	@Column({ nullable: true, enum: RoleType, default: RoleType.USER, name: 'updated_by' })
	updatedBy?: RoleType;

	@Column({
		type: 'enum',
		enum: RevisionType,
		default: RevisionType.PENDING,
		name: 'revision_type',
	})
	revisionType?: RevisionType;

	@Column({
		type: 'enum',
		enum: RoleType,
		default: RoleType.USER,
		name: 'created_by',
	})
	createdBy: RoleType;

	@Column({
		type: 'enum',
		enum: ViewType,
		default: ViewType.SECONDARY,
		name: 'view_type',
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
