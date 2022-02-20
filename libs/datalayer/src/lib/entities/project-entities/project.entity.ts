import { start } from 'repl'
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm'
import { Project } from '../../models/project-models'
import { ClientEntity } from './client.entity'
import { TaskEntity } from './task.entity'

@Entity()
export class ProjectEntity implements Project {
  constructor(
    id?: number,
    name?: string,
    startDate?: Date,
    endDate?: Date,
    hoursPerDay?: number,
    client?: ClientEntity,
    tasks?: TaskEntity[],
  ) {
    this.id = id ?? null
    this.name = name ?? null
    this.startDate = startDate ?? null
    this.endDate = endDate ?? null
    this.hoursPerDay = hoursPerDay ?? null
    this.client = client ?? null
    this.tasks = tasks ?? null
  }
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

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

  // public static fromDto(project: Project): ProjectEntity {
  //   if (project == null || project == undefined) return new ProjectEntity()
  //   return new ProjectEntity(
  //     project.id,
  //     project.name,
  //     project.startDate,
  //     project.endDate,
  //     project.hoursPerDay,
  //     ClientEntity.fromDto(project.client),
  //     project.tasks.map(task => TaskEntity.fromDto(task))
  //   )
  // }
}
