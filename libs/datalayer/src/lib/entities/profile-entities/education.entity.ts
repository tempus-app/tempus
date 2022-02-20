import { start } from 'repl'
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm'
import { Education } from '../../models/profile-models'
import { ResourceEntity } from '../account-entities'
import { LocationEntity } from '../common-entities'

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
    this.id = id ?? null
    this.degree = degree ?? null
    this.institution = institution ?? null
    this.startDate = startDate ?? null
    this.endDate = endDate ?? null
    this.location = location ?? null
    this.resource = resource ?? null
  }

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

  public static fromDto(education: Education): EducationEntity {
    if (education == null || education == undefined) return new EducationEntity()

    let educationEntity = new EducationEntity(
      education.id,
      education.degree,
      education.institution,
      education.startDate,
      education.endDate,
      LocationEntity.fromDto(education.location),
    )

    return educationEntity
  }
}
