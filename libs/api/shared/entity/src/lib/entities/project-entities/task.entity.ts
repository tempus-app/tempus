import { Task } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TaskEntity implements Task {
	constructor(id?: number, taskName?: string) {
		this.id = id;
		this.taskName = taskName;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	taskName: string;
}
