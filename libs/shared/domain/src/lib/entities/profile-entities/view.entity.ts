import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { SkillEntity } from './skill.entity';
import { RevisionEntity } from './revision.entity';
import { ExperienceEntity } from './experience.entity';
import { CertificationEntity, EducationEntity } from '.';
import { ResourceEntity } from '../account-entities';
import { ViewType } from '../../enums';
import { View } from '../..';

@Entity()
export class ViewEntity implements View {
	constructor(
		id?: number,
		profileSummary?: string,
		skillsSummary?: string,
		educationsSummary?: string,
		experiencesSummary?: string,
		type?: string,
		status?: RevisionEntity[],
		skills?: SkillEntity[],
		experiences?: ExperienceEntity[],
		educations?: EducationEntity[],
		certifications?: CertificationEntity[],
		resource?: ResourceEntity,
		viewType?: ViewType,
	) {
		this.id = id || 0;
		this.profileSummary = profileSummary || '';
		this.skillsSummary = skillsSummary || '';
		this.educationsSummary = educationsSummary || '';
		this.experiencesSummary = experiencesSummary || '';
		this.type = type || '';
		this.status = status || [];
		this.skills = skills || [];
		this.experiences = experiences || [];
		this.educations = educations || [];
		this.certifications = certifications || [];
		this.resource = resource || new ResourceEntity();
		this.viewType = viewType || ViewType.PRIMARY;
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

	@OneToMany(() => RevisionEntity, status => status.view)
	status: RevisionEntity[];

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
}
