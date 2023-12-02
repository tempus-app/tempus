import { ProjectResource } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ResourceEntity } from '../account-entities';
import { ProjectEntity } from './project.entity';

@Entity()
export class ProjectResourceEntity implements ProjectResource {
	constructor(
		id?: number,
		startDate?: Date,
		endDate?: Date,
		resource?: ResourceEntity,
		project?: ProjectEntity,
		title?: string,
		costRate?: number,
		billRate?: number,

	) {
		this.id = id;
		this.startDate = startDate;
		this.endDate = endDate;
		this.resource = resource;
		this.project = project;
		this.title = title;
		this.costRate = costRate;
		this.billRate = billRate;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	startDate: Date;

	@Column({ nullable: true })
	endDate: Date;

	@Column({ nullable: true })
	title: string;

	@Column({ nullable: true })
	costRate: number;

	@Column({ nullable: true })
	billRate: number;

	@ManyToOne(() => ResourceEntity, resource => resource, { primary: true, onDelete: 'CASCADE' })
	resource: ResourceEntity;

	@ManyToOne(() => ProjectEntity, project => project.projectResources, { primary: true, onDelete: 'CASCADE' })
	project: ProjectEntity;
}
