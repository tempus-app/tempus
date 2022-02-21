import { ChildEntity, Column, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm'
import { LocationEntity } from '../common-entities'
import { CertificationEntity, EducationEntity, ExperienceEntity, SkillEntity, ViewEntity } from '../profile-entities'
import { ProjectEntity } from '../project-entities'
import { UserEntity } from './user.entity'

@ChildEntity()
export class ResourceEntity extends UserEntity {
  constructor(
    id?: number,
    phoneNumber?: string,
    title?: string,
    location?: LocationEntity,
    projects?: ProjectEntity[],
    views?: ViewEntity[],
    experiences?: ExperienceEntity[],
    educations?: EducationEntity[],
    skills?: SkillEntity[],
    certifications?: CertificationEntity[],
  ) {
    super()
    this.id = id ?? null
    this.phoneNumber = phoneNumber ?? null
    this.title = title ?? null
    this.location = location ?? null
    this.projects = projects ?? null
    this.views = views ?? null
    this.experiences = experiences ?? null
    this.educations = educations ?? null
    this.skills = skills ?? null
    this.certifications = certifications ?? null
  }

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

  @OneToMany(() => EducationEntity, (education) => education.resource, { cascade: true })
  educations: EducationEntity[]

  @OneToMany(() => SkillEntity, (skill) => skill.resource)
  skills: SkillEntity[]

  @OneToMany(() => CertificationEntity, (certification) => certification.resource)
  certifications: CertificationEntity[]
}
