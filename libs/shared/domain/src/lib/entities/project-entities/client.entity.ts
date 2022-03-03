import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Client } from '../..';
import { ProjectEntity } from './project.entity';

@Entity()
export class ClientEntity implements Client {
	constructor(id?: number, name?: string, title?: string, clientName?: string, projects?: ProjectEntity[]) {
		this.id = id;
		this.name = name;
		this.title = title;
		this.clientName = clientName;
		this.projects = projects;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	title: string;

	@Column()
	clientName: string;

	@OneToMany(() => ProjectEntity, projects => projects.client)
	projects: ProjectEntity[];
}
