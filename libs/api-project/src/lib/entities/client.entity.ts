import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { Client } from '../models'
import { ProjectEntity } from './project.entity'

@Entity()
export class ClientEntity implements Client {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  title: string

  @Column()
  clientName: string

  @OneToMany(() => ProjectEntity, (projects) => projects.client)
  projects?: ProjectEntity[]
}
