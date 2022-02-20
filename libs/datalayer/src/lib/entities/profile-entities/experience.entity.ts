import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm'
import { Experience } from '../../models/profile-models'
import { ResourceEntity } from '../account-entities'
import { LocationEntity } from '../common-entities'

@Entity()
export class ExperienceEntity implements Experience {
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

  @ManyToOne(() => ResourceEntity, (resource) => resource.experiences)
  resource: ResourceEntity
}
