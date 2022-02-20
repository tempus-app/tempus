import { ChildEntity, Column, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm'
import { Resource } from '../../models/account-models'
import { LocationEntity } from '../common-entities'
import { CertificationEntity, EducationEntity, ExperienceEntity, SkillEntity, ViewEntity } from '../profile-entities'
import { ProjectEntity } from '../project-entities'
import { UserEntity } from './user.entity'

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
