import { Entity, Column, PrimaryGeneratedColumn, TableInheritance, OneToMany, ManyToOne } from 'typeorm'
import { Project } from './project.entity'

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  taskName: string

  @ManyToOne(() => Project, (project) => project.tasks)
  project: Project[]
}
