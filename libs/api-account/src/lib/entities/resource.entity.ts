import { ChildEntity, Column, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm'
import { UserEntity } from './user.entity'
import { ProjectEntity } from '@tempus/api-project'
import { SkillEntity, ViewEntity, EducationEntity, ExperienceEntity, CertificationEntity } from '@tempus/api-profile'
import { LocationEntity } from '@tempus/api-common'
import { Resource } from '../models/resource.model'

@ChildEntity()
export class ResourceEntity extends UserEntity implements Resource {
  @Column({ nullable: true })
  phoneNumber: string

  @Column({ nullable: true })
  title: string

  @OneToOne(() => LocationEntity)
  location: LocationEntity

  @ManyToMany(() => ProjectEntity)
  @JoinTable()
  projects: ProjectEntity[]

  @OneToMany(() => ViewEntity, (views) => views.resource)
  views: ViewEntity[]

  @OneToMany(() => ExperienceEntity, (experience) => experience.resource)
  experiences: ExperienceEntity[]

  @OneToMany(() => EducationEntity, (education) => education.resource)
  educations: EducationEntity[]

  @OneToMany(() => SkillEntity, (skill) => skill.resource)
  skills: SkillEntity[]

  @OneToMany(() => CertificationEntity, (certification) => certification.resource)
  certifications: CertificationEntity[]
}
