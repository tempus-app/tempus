import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  ManyToOne,
  Unique,
  PrimaryColumn,
} from 'typeorm'
import { View } from './view.entity'

@Unique('primary_key_constraint', ['name'])
@Entity()
export class SkillType {
  @Column({ unique: true })
  @PrimaryColumn()
  name: string
}
