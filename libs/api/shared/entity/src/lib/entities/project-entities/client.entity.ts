import { CreateClientDto, UpdateClientDto } from '@tempus/api/shared/dto';
import { Client } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ClientRepresentativeEntity } from './clientRepresentative.entity';
import { ProjectEntity } from './project.entity';

@Entity()
export class ClientEntity implements Client {
	constructor(
		id?: number,
		clientName?: string,
		projects?: ProjectEntity[],
		representatives?: ClientRepresentativeEntity[],
	) {
		this.id = id;
		this.clientName = clientName;
		this.projects = projects;
		this.representatives = representatives;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	clientName: string;

	@OneToMany(() => ProjectEntity, projects => projects.client)
	projects: ProjectEntity[];

	@OneToMany(() => ClientRepresentativeEntity, clients => clients.client)
	representatives: ClientRepresentativeEntity[];

	public static fromDto(dto: CreateClientDto | UpdateClientDto): ClientEntity {
		if (dto == null) return new ClientEntity();
		const id = dto instanceof CreateClientDto ? undefined : dto.id;
		return new ClientEntity(id, dto.clientName, null, null);
	}
}
