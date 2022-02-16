import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, ManyToOne } from 'typeorm'
import { SkillEntity } from './skill.entity'
import { RevisionEntity } from './revision.entity'
import { ExperienceEntity } from './experience.entity'
import { EducationEntity } from '.'
import { ResourceEntity, UserEntity } from 'libs/api-account/src'
import { View } from '../models/view.model'

@Entity()
export class ViewEntity implements View {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  type: string

  @OneToMany(() => RevisionEntity, (status) => status.view)
  status: RevisionEntity[]

  @ManyToMany(() => SkillEntity)
  @JoinTable()
  skills: SkillEntity[]

  @ManyToMany(() => ExperienceEntity)
  @JoinTable()
  experience: ExperienceEntity[]

  @ManyToMany(() => EducationEntity)
  @JoinTable()
  education: EducationEntity[]

  @ManyToOne(() => ResourceEntity, (resource) => resource.views)
  resource: ResourceEntity
}
