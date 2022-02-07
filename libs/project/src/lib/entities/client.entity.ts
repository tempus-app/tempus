import { Entity, Column, PrimaryGeneratedColumn, TableInheritance, OneToMany } from 'typeorm'
import { Project } from './project.entity'

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  clientName: string

  @OneToMany(() => Project, (projects) => projects.client)
  projects: Project[]
}
