import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, ManyToOne } from 'typeorm'
import { Revision } from '../models/revision.model'
import { ViewEntity } from './view.entity'

@Entity()
export class RevisionEntity implements Revision {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  timestamp: Date

  @Column()
  section: string

  @Column()
  approved: boolean

  @ManyToOne(() => ViewEntity, (view) => view.status)
  view: ViewEntity
}
