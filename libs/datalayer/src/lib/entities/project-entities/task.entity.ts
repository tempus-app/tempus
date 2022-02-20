import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { Task } from '../../models/project-models'
import { ProjectEntity } from './project.entity'

@Entity()
export class TaskEntity implements Task {
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

  // public static fromDto(task: Task): TaskEntity {
  //   if (task == null || task == undefined) return new TaskEntity()
  //   return new TaskEntity(
  //     task.id,
  //     task.taskName,
  //     ProjectEntity.fromDto(task.project)
  //   )
  // }
}
