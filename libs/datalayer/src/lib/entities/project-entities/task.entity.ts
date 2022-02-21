import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { ProjectEntity } from './project.entity'

@Entity()
export class TaskEntity {
  constructor(id?: number, taskName?: string, project?: ProjectEntity) {
    this.id = id ?? null
    this.taskName = taskName ?? null
    this.project = project ?? null
  }
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  taskName: string

  @ManyToOne(() => ProjectEntity, (project) => project.tasks)
  project: ProjectEntity
}
