import { Task } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ProjectEntity } from './project.entity';

@Entity()
export class TaskEntity implements Task {
	constructor(id?: number, taskName?: string, project?: ProjectEntity) {
		this.id = id;
		this.taskName = taskName;
		this.project = project;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	taskName: string;

	@ManyToOne(() => ProjectEntity, project => project.tasks)
	project: ProjectEntity;
}