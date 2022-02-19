import { ResourceEntity } from '@tempus/api-account'
import { LocationEntity } from '@tempus/api-common'
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, ManyToOne, OneToOne } from 'typeorm'
import { Education } from '../models/education.model'

@Entity()
export class EducationEntity implements Education {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  degree: string

  @Column()
  institution: string

  @Column()
  startDate: Date

  @Column()
  endDate: Date

  @OneToOne(() => LocationEntity)
  location: LocationEntity

  @ManyToOne(() => ResourceEntity, (resource) => resource.educations)
  resource: ResourceEntity
}
