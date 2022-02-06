import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, ManyToOne } from 'typeorm'
import { Skill } from './skill.entity'
import { Revision } from './revision.entity'
import { Experience } from './experience.entity'
import { Education } from '.'
import { User } from '@tempus/account'

@Entity()
export class View {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  type: string

  @OneToMany(() => Revision, (status) => status.view)
  status: Revision[]

  @ManyToMany(() => Skill)
  @JoinTable()
  skills: Skill[]

  @ManyToMany(() => Experience)
  @JoinTable()
  experience: Experience[]

  @ManyToMany(() => Education)
  @JoinTable()
  education: Education[]

  @ManyToOne(() => User, (user) => user.views)
  user: User
}
