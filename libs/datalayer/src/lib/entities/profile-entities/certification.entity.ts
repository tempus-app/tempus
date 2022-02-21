import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { ResourceEntity } from '../account-entities'

@Entity()
export class CertificationEntity {
  constructor(id?: number, title?: string, institution?: string, resource?: ResourceEntity) {
    this.id = id ?? null
    this.title = title ?? null
    this.institution = institution ?? null
    this.resource = resource ?? null
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  institution: string

  @ManyToOne(() => ResourceEntity, (resource) => resource.certifications, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'update'],
  })
  resource: ResourceEntity

  // public static fromDto(certification: Certification): CertificationEntity {
  //   if (certification == null || certification == undefined) return new CertificationEntity()
  //   return new CertificationEntity(
  //     certification.id,
  //     certification.title,
  //     certification.institution
  //   )
  // }
}
