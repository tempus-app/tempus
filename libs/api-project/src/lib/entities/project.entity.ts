import { Entity, Column, PrimaryGeneratedColumn, TableInheritance, OneToMany, ManyToOne } from 'typeorm'
import { Client } from './client.entity'
import { Task } from './task.entity'

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  projName: string

  @Column()
  startDate: Date

  @Column()
  endDate: Date

  @Column()
  hoursPerDay: number

  @ManyToOne(() => Client, (client) => client.projects)
  client: Client

  @OneToMany(() => Task, (tasks) => tasks.project)
  tasks: Task[]
}
