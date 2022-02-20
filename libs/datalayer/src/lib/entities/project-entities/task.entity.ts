import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { Task } from '../../models/project-models'
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
