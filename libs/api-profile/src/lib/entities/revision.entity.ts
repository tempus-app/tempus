import { UserEntity } from '@tempus/api-account'
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, ManyToOne, OneToOne } from 'typeorm'
import { Revision } from '../models/revision.model'
import { ViewEntity } from './view.entity'

@Entity()
export class RevisionEntity implements Revision {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  createdAt: Date

  @Column()
  approvedAt: Date

  @Column()
  section: string

  @OneToOne(() => UserEntity)
  approver: UserEntity

  @Column()
  approved: boolean

  @ManyToOne(() => ViewEntity, (view) => view.status)
  view: ViewEntity
}
