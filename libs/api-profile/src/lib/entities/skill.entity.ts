import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { Skill } from '../models/skill.model'
import { SkillTypeEntity } from './skilltype.entity'
import { ViewEntity } from './view.entity'

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
}
