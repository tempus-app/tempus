import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Link } from '../models/link.model'
import { UserEntity } from './user.entity'

@Entity()
export class LinkEntity implements Link {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  expiry: Date

  @Column()
  completed: Boolean

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity
}
