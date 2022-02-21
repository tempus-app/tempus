import { Entity, Column, Unique, PrimaryColumn } from 'typeorm'

@Unique('primary_key_constraint', ['name'])
@Entity()
export class SkillTypeEntity {
  constructor(name?: string) {
    this.name = name ?? null
  }
  @Column({ unique: true })
  @PrimaryColumn()
  name: string
}
