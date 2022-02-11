import { Entity, Column, PrimaryGeneratedColumn, TableInheritance, OneToMany, ManyToOne } from 'typeorm'
import { Project } from '../models/project.model'
import { ClientEntity } from './client.entity'
import { TaskEntity } from './task.entity'

@Entity()
export class ProjectEntity implements Project {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string;

  @Column()
  startDate: Date

  @Column()
  endDate: Date

  @Column()
  hoursPerDay: number

  @ManyToOne(() => ClientEntity, (client) => client.projects)
  client: ClientEntity

  @OneToMany(() => TaskEntity, (tasks) => tasks.project)
  tasks: TaskEntity[]
}
