import { ResourceEntity } from '@tempus/api-account'
import { LocationEntity } from '@tempus/api-common'
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, ManyToOne, OneToOne } from 'typeorm'
import { Experience } from '../models/experience.model'

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
