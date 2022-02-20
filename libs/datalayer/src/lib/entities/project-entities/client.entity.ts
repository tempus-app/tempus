import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { Client } from '../../models/project-models'
import { ProjectEntity } from './project.entity'

@Entity()
export class ClientEntity implements Client {
  constructor(id?: number, name?: string, title?: string, clientName?: string, projects?: ProjectEntity[]) {
    this.id = id ?? null
    this.name = name ?? null
    this.title = title ?? null
    this.clientName = clientName ?? null
    this.projects = projects ?? null
  }
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

  // public static fromDto(client: Client): ClientEntity {
  //   if (client == null || client == undefined) return new ClientEntity()
  //   return new ClientEntity(
  //     client.id,
  //     client.name,
  //     client.title,
  //     client.name,
  //     client.projects.map(project => ProjectEntity.fromDto(project))
  //   )
  // }
}
