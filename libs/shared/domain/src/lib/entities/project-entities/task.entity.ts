import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Task } from '../..';
import { ProjectEntity } from './project.entity';

@Entity()
export class TaskEntity implements Task {
	constructor(id?: number, taskName?: string, project?: ProjectEntity) {
		this.id = id || 0;
		this.taskName = taskName || '';
		this.project = project || new ProjectEntity();
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	taskName: string;

	@ManyToOne(() => ProjectEntity, project => project.tasks)
	project: ProjectEntity;
}
