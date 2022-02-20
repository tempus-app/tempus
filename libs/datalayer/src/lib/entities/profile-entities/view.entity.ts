import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, ManyToOne } from 'typeorm'
import { SkillEntity } from './skill.entity'
import { RevisionEntity } from './revision.entity'
import { ExperienceEntity } from './experience.entity'
import { EducationEntity } from './'
import { View, ViewType } from '../../models/profile-models'
import { ResourceEntity } from '../account-entities'

@Entity()
export class ViewEntity implements View {
  constructor(
    id?: number,
    type?: string,
    status?: RevisionEntity[],
    skills?: SkillEntity[],
    experiences?: ExperienceEntity[],
    educations?: EducationEntity[],
    resource?: ResourceEntity,
    viewType?: ViewType,
  ) {
    ;(this.id = id ?? null), (this.type = type ?? null)
    this.status = status ?? null
    this.skills = skills ?? null
    this.experiences = experiences ?? null
    this.educations = educations ?? null
    this.resource = resource ?? null
    this.viewType = viewType ?? null
  }
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
  experiences: ExperienceEntity[]

  @ManyToMany(() => EducationEntity)
  @JoinTable()
  educations: EducationEntity[]

  @ManyToOne(() => ResourceEntity, (resource) => resource.views)
  resource: ResourceEntity

  @Column({
    type: 'enum',
    enum: ViewType,
    default: ViewType.SECONDARY,
  })
  viewType: ViewType

  // public static fromDto(view: View): ViewEntity {
  //   if (view == null || view == undefined) return new ViewEntity()
  //   return new ViewEntity(
  //     view.id,
  //     view.type,
  //     view.status.map(status => RevisionEntity.fromDto(status)),

  //   )
  // }
}
