import { ClientRepresentative } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { ClientEntity } from './client.entity';
import { ProjectEntity } from './project.entity';
import { TimesheetEntity } from '../timesheet-entities';

@Entity()
export class ClientRepresentativeEntity implements ClientRepresentative {
	constructor(
		id?: number,
		firstName?: string,
		lastName?: string,
		email?: string,
		client?: ClientEntity,
		projects?: ProjectEntity[],
		timesheets?: TimesheetEntity[],
	) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.client = client;
		this.projects = projects;
		this.timesheets = timesheets;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@Column({ unique: true })
	email: string;

	@ManyToOne(() => ClientEntity, clients => clients, { onDelete: 'CASCADE' })
	client: ClientEntity;

	@OneToMany(() => ProjectEntity, projects => projects.clientRepresentative)
	projects: ProjectEntity[];

	@OneToMany(() => TimesheetEntity, timesheets => timesheets.supervisor)
	timesheets: TimesheetEntity[];
}
