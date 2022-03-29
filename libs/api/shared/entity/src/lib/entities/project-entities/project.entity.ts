import { CreateProjectDto } from '@tempus/api/shared/dto';
import { Project } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany } from 'typeorm';
import { ResourceEntity } from '../account-entities';
import { ClientEntity } from './client.entity';

@Entity()
export class ProjectEntity implements Project {
	constructor(id?: number, name?: string, startDate?: Date, endDate?: Date, client?: ClientEntity) {
		this.id = id;
		this.name = name;
		this.startDate = startDate;
		this.endDate = endDate;
		this.client = client;
		this.resources = [];
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

	@ManyToMany(() => ResourceEntity, resources => resources.projects)
	resources: ResourceEntity[];

	public static fromDto(dto: CreateProjectDto): ProjectEntity {
		if (dto == null) return new ProjectEntity();
		return new ProjectEntity(null, dto.name, dto.startDate, dto.endDate, null);
	}
}
