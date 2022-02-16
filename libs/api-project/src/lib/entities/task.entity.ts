import { Entity, Column, PrimaryGeneratedColumn, TableInheritance, OneToMany, ManyToOne } from 'typeorm'
import { Task } from '../models'
import { ProjectEntity } from './project.entity'

@Entity()
export class TaskEntity implements Task {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  taskName: string

  @ManyToOne(() => ProjectEntity, (project) => project.tasks)
  project: ProjectEntity[]
}
