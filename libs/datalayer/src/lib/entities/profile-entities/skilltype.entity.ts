import { Entity, Column, Unique, PrimaryColumn } from 'typeorm'
import { SkillType } from '../..'

@Unique('primary_key_constraint', ['name'])
@Entity()
export class SkillTypeEntity implements SkillType {
  constructor(name?: string) {
    this.name = name
  }
  @Column({ unique: true })
  @PrimaryColumn()
  name: string
}
