import { ChildEntity, Column, JoinTable, ManyToMany, OneToMany } from 'typeorm'
import { User } from './user.entity'
import { Project } from '@tempus/project'
import { View } from '@tempus/profile'

@ChildEntity()
export class Resource extends User {
  @Column({ nullable: true })
  phoneNumber: string

  @Column({ nullable: true })
  location: string

  @Column({ nullable: true })
  title: string

  @ManyToMany(() => Project)
  @JoinTable()
  projects: Project[]

  @OneToMany(() => View, (views) => views.resource)
  views: View[]
}
