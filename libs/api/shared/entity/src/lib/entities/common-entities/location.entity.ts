import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Location } from '@tempus/shared-domain';
import { CreateLocationDto } from '@tempus/api/shared/dto';
import { EducationEntity, ExperienceEntity, ResourceEntity } from '..';

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
		this.id = id;
		this.city = city;
		this.province = province;
		this.country = country;
		this.education = education;
		this.experience = experience;
		this.resource = resource;
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

	public static fromDto(dto: CreateLocationDto): LocationEntity {
		if (dto == null) return new LocationEntity();
		return new LocationEntity(undefined, dto.city, dto.province, dto.country);
	}
}
