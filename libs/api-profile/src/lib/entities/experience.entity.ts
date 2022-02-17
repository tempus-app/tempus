import { ResourceEntity } from '@tempus/api-account'
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, ManyToOne } from 'typeorm'
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

  @ManyToOne(() => ResourceEntity, (resource) => resource.experiences)
  resource: ResourceEntity
}
