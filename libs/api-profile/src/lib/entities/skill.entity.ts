import { ResourceEntity } from '@tempus/api-account'
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm'
import { Skill } from '../models/skill.model'
import { SkillTypeEntity } from './skilltype.entity'

@Entity()
export class SkillEntity implements Skill {
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
