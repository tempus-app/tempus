import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm'
import { Education } from '../../models/profile-models'
import { ResourceEntity } from '../account-entities'
import { LocationEntity } from '../common-entities'

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

  @ManyToOne(() => ResourceEntity, (resource) => resource.educations, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'update'],
  })
  resource: ResourceEntity
}
