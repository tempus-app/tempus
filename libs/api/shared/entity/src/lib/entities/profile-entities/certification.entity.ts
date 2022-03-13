import { CreateCertificationDto } from '@tempus/api/shared/dto';
import { Certification } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ResourceEntity } from '../account-entities';

@Entity()
export class CertificationEntity implements Certification {
	constructor(id?: number, title?: string, institution?: string, resource?: ResourceEntity) {
		this.id = id;
		this.title = title;
		this.institution = institution;
		this.resource = resource;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@Column()
	institution: string;

	@ManyToOne(() => ResourceEntity, resource => resource.certifications, {
		onDelete: 'CASCADE',
	})
	resource: ResourceEntity;

	public static fromDto(dto: CreateCertificationDto): CertificationEntity {
		if (dto == null) return new CertificationEntity();
		return new CertificationEntity(undefined, dto.title, dto.institution);
	}
}
