import { CreateProjectDto } from '@tempus/api/shared/dto';
import { Project, ProjectStatus } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany } from 'typeorm';
import { ResourceEntity } from '../account-entities';
import { ClientEntity } from './client.entity';
import { ClientRepresentativeEntity } from './clientRepresentative.entity';

@Entity()
export class ProjectEntity implements Project {
	constructor(
		id?: number,
		name?: string,
		startDate?: Date,
		client?: ClientEntity,
		projectManager?: ResourceEntity,
		resources?: ResourceEntity[],
		clientRepresentative?: ClientRepresentativeEntity,
		status?: ProjectStatus,
	) {
		this.id = id;
		this.name = name;
		this.startDate = startDate;
		this.client = client;
		this.resources = resources;
		this.projectManager = projectManager;
		this.clientRepresentative = clientRepresentative;
		this.status = status;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	startDate: Date;

	@ManyToOne(() => ClientEntity, client => client.projects)
	client: ClientEntity;

	@ManyToMany(() => ResourceEntity, resources => resources.projects)
	resources: ResourceEntity[];

	@ManyToOne(() => ResourceEntity, resouce => resouce)
	projectManager: ResourceEntity;

	@ManyToOne(() => ClientRepresentativeEntity, clientRepresentative => clientRepresentative.projects)
	clientRepresentative: ClientRepresentativeEntity;

	@Column({
		type: 'enum',
		enum: ProjectStatus,
		array: true,
		default: [ProjectStatus.NOT_STARTED],
	})
	status: ProjectStatus;

	public static fromDto(dto: CreateProjectDto): ProjectEntity {
		if (dto == null) return new ProjectEntity();
		return new ProjectEntity(null, dto.name, dto.startDate, null);
	}
}
