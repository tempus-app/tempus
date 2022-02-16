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
import { ViewEntity } from './view.entity'

@Unique('primary_key_constraint', ['name'])
@Entity()
export class SkillTypeEntity {
  @Column({ unique: true })
  @PrimaryColumn()
  name: string
}
