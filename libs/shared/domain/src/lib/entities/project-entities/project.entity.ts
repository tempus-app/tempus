import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Project } from '../..';
import { ClientEntity } from './client.entity';
import { TaskEntity } from './task.entity';

@Entity()
export class ProjectEntity implements Project {
	constructor(
		id?: number,
		name?: string,
		startDate?: Date,
		endDate?: Date,
		hoursPerDay?: number,
		client?: ClientEntity,
		tasks?: TaskEntity[],
	) {
		this.id = id || 0;
		this.name = name || '';
		this.startDate = startDate || new Date();
		this.endDate = endDate || new Date();
		this.hoursPerDay = hoursPerDay || 0;
		this.client = client || new ClientEntity();
		this.tasks = tasks || [];
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	startDate: Date;

	@Column()
	endDate: Date;

	@Column()
	hoursPerDay: number;

	@ManyToOne(() => ClientEntity, client => client.projects)
	client: ClientEntity;

	@OneToMany(() => TaskEntity, tasks => tasks.project)
	tasks: TaskEntity[];
}
