import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm'
import { Skill } from '../../models/profile-models'
import { ResourceEntity } from '../account-entities'
import { SkillTypeEntity } from './skilltype.entity'

@Entity()
export class SkillEntity implements Skill {
  constructor(id?: number, skill?: SkillTypeEntity, level?: number, resource?: ResourceEntity) {
    this.id = id ?? null
    this.skill = skill ?? null
    this.level = level ?? null
    this.resource = resource ?? null
  }

  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(() => SkillTypeEntity)
  @JoinColumn()
  skill: SkillTypeEntity

  //must be 1-5, figure it out later
  @Column()
  level: number

  @ManyToOne(() => ResourceEntity, (resource) => resource.skills)
  resource: ResourceEntity
}
