import { CreateProjectDto } from '@tempus/api/shared/dto';
import { Project } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { ClientEntity } from './client.entity';
import { TaskEntity } from './task.entity';

@Entity()
export class ProjectEntity implements Project {
	constructor(
		id?: number,
		name?: string,
		startDate?: Date,
		endDate?: Date,
		client?: ClientEntity,
		tasks?: TaskEntity[],
	) {
		this.id = id;
		this.name = name;
		this.startDate = startDate;
		this.endDate = endDate;
		this.client = client;
		this.tasks = tasks;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	startDate: Date;

	@Column()
	endDate: Date;

	@ManyToOne(() => ClientEntity, client => client.projects)
	client: ClientEntity;

	@OneToMany(() => TaskEntity, tasks => tasks.project)
	tasks: TaskEntity[];

	public static fromDto(dto: CreateProjectDto): ProjectEntity {
		if (dto == null) return new ProjectEntity();
		return new ProjectEntity(null, dto.name, dto.startDate, dto.endDate, null);
	}
}
