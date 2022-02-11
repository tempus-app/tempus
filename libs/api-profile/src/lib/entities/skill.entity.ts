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
import { SkillType } from './skilltype.entity'
import { View } from './view.entity'

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(() => SkillType)
  @JoinColumn()
  skill: SkillType

  //must be 1-5, figure it out later
  @Column()
  level: number
}
