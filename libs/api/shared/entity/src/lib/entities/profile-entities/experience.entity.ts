import { CreateExperienceDto } from '@tempus/api/shared/dto';
import { Experience } from '@tempus/shared-domain';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, Check } from 'typeorm';
import { ResourceEntity } from '../account-entities';
import { LocationEntity } from '../common-entities';

@Entity()
@Check('"endDate" >= "startDate"')
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
		this.id = id;
		this.title = title;
		this.company = company;
		this.summary = summary;
		this.description = description;
		this.startDate = startDate;
		this.endDate = endDate;
		this.location = location;
		this.resource = resource;
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

	@Column({ nullable: true })
	endDate: Date;

	@OneToOne(() => LocationEntity, location => location.experience, { cascade: ['insert', 'update'] })
	location: LocationEntity;

	@ManyToOne(() => ResourceEntity, resource => resource.experiences, {
		onDelete: 'CASCADE',
	})
	resource: ResourceEntity;

	public static fromDto(dto: CreateExperienceDto): ExperienceEntity {
		if (dto == null) return new ExperienceEntity();
		return new ExperienceEntity(
			undefined,
			dto.title,
			dto.company,
			dto.summary,
			dto.description,
			dto.startDate,
			dto.endDate,
			LocationEntity.fromDto(dto.location),
		);
	}
}
