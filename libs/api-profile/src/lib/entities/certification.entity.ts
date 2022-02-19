import { ResourceEntity } from '@tempus/api-account'
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { Certification } from '../models/certification.model'

@Entity()
export class CertificationEntity implements Certification {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  institution: string

  @ManyToOne(() => ResourceEntity, (resource) => resource.certifications)
  resource: ResourceEntity
}
