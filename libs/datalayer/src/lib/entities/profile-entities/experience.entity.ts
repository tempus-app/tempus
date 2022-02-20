import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm'
import { Experience } from '../../models/profile-models'
import { ResourceEntity } from '../account-entities'
import { LocationEntity } from '../common-entities'

@Entity()
export class ExperienceEntity implements Experience {
  constructor(
    id?: number,
    title?: string,
    description?: string,
    startDate?: Date,
    endDate?: Date,
    location?: LocationEntity,
    resource?: ResourceEntity,
  ) {
    this.id = id ?? null
    this.title = title ?? null
    this.description = description ?? null
    this.startDate = startDate ?? null
    this.endDate = endDate ?? null
    this.location = location ?? null
    this.resource = resource ?? null
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  startDate: Date

  @Column()
  endDate: Date

  @OneToOne(() => LocationEntity)
  location: LocationEntity

  @ManyToOne(() => ResourceEntity, (resource) => resource.experiences, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'update'],
  })
  resource: ResourceEntity

  // public static fromDto(experience: Experience): ExperienceEntity {
  //   if (experience == null || experience == undefined) return new ExperienceEntity()
  //   return new ExperienceEntity(
  //     experience.id,
  //     experience.title,
  //     experience.description,
  //     experience.startDate,
  //     experience.endDate,
  //     LocationEntity.fromDto(experience.location)
  //   )
  // }
}
