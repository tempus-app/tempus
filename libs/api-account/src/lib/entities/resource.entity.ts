import { ChildEntity, Column, JoinTable, ManyToMany, OneToMany } from 'typeorm'
import { UserEntity } from './user.entity'
import { ProjectEntity } from 'libs/api-project/src'
import { ViewEntity } from 'libs/api-profile/src'
import { Resource } from '../models/resource.model'

@ChildEntity()
export class ResourceEntity extends UserEntity implements Resource {
  @Column({ nullable: true })
  phoneNumber: string

  @Column({ nullable: true })
  location: string

  @Column({ nullable: true })
  title: string

  @ManyToMany(() => ProjectEntity)
  @JoinTable()
  projects: ProjectEntity[]

  @OneToMany(() => ViewEntity, (views) => views.resource)
  views: ViewEntity[]
}
