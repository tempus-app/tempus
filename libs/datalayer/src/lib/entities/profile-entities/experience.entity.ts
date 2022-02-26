import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm'
import { Experience } from '../../models'
import { ResourceEntity } from '../account-entities'
import { LocationEntity } from '../common-entities'

@Entity()
export class ExperienceEntity implements Experience {
  constructor(
    id?: number,
    title?: string,
    summary?: string,
    description?: string[],
    startDate?: Date,
    endDate?: Date,
    location?: LocationEntity,
    resource?: ResourceEntity
  ) {
    this.id = id
    this.title = title
    this.summary = summary
    this.description = description
    this.startDate = startDate
    this.endDate = endDate
    this.location = location
    this.resource = resource
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  company: string

  @Column()
  title: string

  @Column()
  summary: string

  @Column('simple-array', { nullable: true })
  description: string[]

  @Column()
  startDate: Date

  @Column()
  endDate: Date

  @OneToOne(() => LocationEntity, location => location.experience, { cascade: ['insert', 'update'] })
  location: LocationEntity

  @ManyToOne(() => ResourceEntity, resource => resource.experiences, {
    onDelete: 'CASCADE',
  })
  resource: ResourceEntity
}
