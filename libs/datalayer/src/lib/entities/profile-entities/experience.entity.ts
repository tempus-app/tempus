import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm'
import { ResourceEntity } from '../account-entities'
import { LocationEntity } from '../common-entities'

@Entity()
export class ExperienceEntity {
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

  @OneToOne(() => LocationEntity, (location) => location.experience, { cascade: ['insert', 'update'] })
  location: LocationEntity

  @ManyToOne(() => ResourceEntity, (resource) => resource.experiences, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'update'],
  })
  resource: ResourceEntity
}
