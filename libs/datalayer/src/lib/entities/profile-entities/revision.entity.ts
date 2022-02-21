import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToOne } from 'typeorm'
import { ResumeSectionType } from '../../enums'
import { UserEntity } from '../account-entities'
import { ViewEntity } from './view.entity'

@Entity()
export class RevisionEntity {
  constructor(
    id?: number,
    createdAt?: Date,
    approvedAt?: Date,
    sectionsChanged?: ResumeSectionType[],
    approver?: UserEntity,
    approved?: boolean,
    view?: ViewEntity,
  ) {
    this.id = id ?? null
    this.createdAt = createdAt ?? null
    this.approvedAt = approvedAt ?? null
    this.sectionsChanged = sectionsChanged ?? null
    this.approver = approver ?? null
    this.approved = approved ?? null
    this.view = view ?? null
  }
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
