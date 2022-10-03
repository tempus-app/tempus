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
	) {
		this.id = id;
		this.startDate = startDate;
		this.endDate = endDate;
		this.resource = resource;
		this.project = project;
		this.title = title;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	startDate: Date;

	@Column({ nullable: true })
	endDate: Date;

	@Column({ nullable: true })
	title: string;

	@ManyToOne(() => ResourceEntity, resource => resource, { primary: true })
	resource: ResourceEntity;

	@ManyToOne(() => ProjectEntity, project => project.projectResource, { primary: true })
	project: ProjectEntity;
}
