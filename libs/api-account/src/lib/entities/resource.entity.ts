import { ChildEntity, Column, JoinTable, ManyToMany, OneToMany } from 'typeorm'
import { UserEntity } from './user.entity'
import { ProjectEntity } from '@tempus/api-project'
import { SkillEntity, ViewEntity, EducationEntity, ExperienceEntity } from '@tempus/api-profile'
import { Resource } from '../models/resource.model'

@ChildEntity()
export class ResourceEntity extends UserEntity implements Resource {
  @Column({ nullable: true })
  phoneNumber: string

  @Column({ nullable: true })
  location: string

  @Column({ nullable: true })
  title: string

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
}
