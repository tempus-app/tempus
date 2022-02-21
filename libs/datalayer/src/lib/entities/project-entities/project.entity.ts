import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm'
import { ClientEntity } from './client.entity'
import { TaskEntity } from './task.entity'

@Entity()
export class ProjectEntity {
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
}
