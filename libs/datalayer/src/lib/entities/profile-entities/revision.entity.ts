import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToOne } from 'typeorm'
import { Revision } from '../../models/profile-models'
import { ResumeSectionType } from '../../models/profile-models/resumesectiontype'
import { UserEntity } from '../account-entities'
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
