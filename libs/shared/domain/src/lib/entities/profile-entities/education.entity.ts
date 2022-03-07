import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm';
import { Education } from '../../models';
import { ResourceEntity } from '../account-entities';
import { LocationEntity } from '../common-entities';

@Entity()
export class EducationEntity implements Education {
	constructor(
		id?: number,
		degree?: string,
		institution?: string,
		startDate?: Date,
		endDate?: Date,
		location?: LocationEntity,
		resource?: ResourceEntity,
	) {
		this.id = id || 0;
		this.degree = degree || '';
		this.institution = institution || '';
		this.startDate = startDate || new Date();
		this.endDate = endDate || new Date();
		this.location = location || new LocationEntity();
		this.resource = resource || new ResourceEntity();
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	degree: string;

	@Column()
	institution: string;

	@Column()
	startDate: Date;

	@Column()
	endDate: Date;

	@OneToOne(() => LocationEntity, location => location.education, {
		cascade: ['insert', 'update'],
	})
	location: LocationEntity;

	@ManyToOne(() => ResourceEntity, resource => resource.educations, {
		onDelete: 'CASCADE',
	})
	resource: ResourceEntity;
}
