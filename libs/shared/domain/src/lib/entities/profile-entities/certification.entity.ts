import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Certification } from '../..';
import { ResourceEntity } from '../account-entities';

@Entity()
export class CertificationEntity implements Certification {
	constructor(id?: number, title?: string, institution?: string, resource?: ResourceEntity) {
		this.id = id || 0;
		this.title = title || '';
		this.institution = institution || '';
		this.resource = resource || new ResourceEntity();
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
}
