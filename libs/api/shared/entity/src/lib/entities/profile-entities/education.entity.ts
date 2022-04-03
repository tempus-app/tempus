import { CreateEducationDto } from '@tempus/api/shared/dto';
import { Education } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm';
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
		this.id = id;
		this.degree = degree;
		this.institution = institution;
		this.startDate = startDate;
		this.endDate = endDate;
		this.location = location;
		this.resource = resource;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	degree: string;

	@Column()
	institution: string;

	@Column()
	startDate: Date;

	@Column({ nullable: true })
	endDate: Date;

	@OneToOne(() => LocationEntity, location => location.education, {
		cascade: ['insert', 'update'],
	})
	location: LocationEntity;

	@ManyToOne(() => ResourceEntity, resource => resource.educations, {
		onDelete: 'CASCADE',
	})
	resource: ResourceEntity;

	public static fromDto(dto: CreateEducationDto): EducationEntity {
		if (dto == null) return new EducationEntity();
		return new EducationEntity(
			undefined,
			dto.degree,
			dto.institution,
			dto.startDate,
			dto.endDate,
			LocationEntity.fromDto(dto.location),
		);
	}
}
