import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Link } from '../models/link.model'
import { StatusType } from '../models/status'
import { UserEntity } from './user.entity'

@Entity()
export class LinkEntity implements Link {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  createdAt: Date

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column()
  expiry: Date

  @Column()
  token: string

  @Column({
    type: 'enum',
    enum: StatusType,
    default: [StatusType.ACTIVE],
  })
  status: StatusType

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user?: UserEntity
}