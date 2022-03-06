import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm';
import { Experience } from '../../models';
import { ResourceEntity } from '../account-entities';
import { LocationEntity } from '../common-entities';

@Entity()
export class ExperienceEntity implements Experience {
	constructor(
		id?: number,
		title?: string,
		company?: string,
		summary?: string,
		description?: string[],
		startDate?: Date,
		endDate?: Date,
		location?: LocationEntity,
		resource?: ResourceEntity,
	) {
		this.id = id || 0;
		this.title = title || '';
		this.company = company || '';
		this.summary = summary || '';
		this.description = description || [];
		this.startDate = startDate || new Date();
		this.endDate = endDate || new Date();
		this.location = location || new LocationEntity();
		this.resource = resource || new ResourceEntity();
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	company: string;

	@Column()
	title: string;

	@Column()
	summary: string;

	@Column('simple-array', { nullable: true })
	description: string[];

	@Column()
	startDate: Date;

	@Column()
	endDate: Date;

	@OneToOne(() => LocationEntity, location => location.experience, { cascade: ['insert', 'update'] })
	location: LocationEntity;

	@ManyToOne(() => ResourceEntity, resource => resource.experiences, {
		onDelete: 'CASCADE',
	})
	resource: ResourceEntity;
}
