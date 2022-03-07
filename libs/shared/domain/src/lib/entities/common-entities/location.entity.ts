import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EducationEntity, ExperienceEntity, ResourceEntity } from '..';
import { Location } from '../..';

@Entity()
export class LocationEntity implements Location {
	constructor(
		id?: number,
		city?: string,
		province?: string,
		country?: string,
		education?: EducationEntity,
		experience?: ExperienceEntity,
		resource?: ResourceEntity,
	) {
		this.id = id || 0;
		this.city = city || '';
		this.province = province || '';
		this.country = country || '';
		this.education = education || new EducationEntity();
		this.experience = experience || new ExperienceEntity();
		this.resource = resource || new ResourceEntity();
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	city: string;

	@Column()
	province: string;

	@Column()
	country: string;

	@OneToOne(() => EducationEntity, edu => edu.location, { onDelete: 'CASCADE' })
	@JoinColumn()
	education?: EducationEntity;

	@OneToOne(() => ExperienceEntity, exp => exp.location, { onDelete: 'CASCADE' })
	@JoinColumn()
	experience?: ExperienceEntity;

	@OneToOne(() => ResourceEntity, res => res.location, { onDelete: 'CASCADE' })
	@JoinColumn()
	resource?: ResourceEntity;
}
