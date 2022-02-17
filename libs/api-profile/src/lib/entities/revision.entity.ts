import { UserEntity } from '@tempus/api-account'
import { array } from 'joi'
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, ManyToOne, OneToOne } from 'typeorm'
import { ResumeSectionType } from '../models/resumesectiontype'
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

  @Column({
    type: 'enum',
    enum: ResumeSectionType,
    default: [ResumeSectionType.PERSONAL],
    array: true,
  })
  sectionsChanged: ResumeSectionType[]

  @OneToOne(() => UserEntity)
  approver: UserEntity

  @Column()
  approved: boolean

  @ManyToOne(() => ViewEntity, (view) => view.status)
  view: ViewEntity
}
