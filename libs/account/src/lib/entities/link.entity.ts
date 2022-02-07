import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'

@Entity()
export class Link {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  expiry: Date

  @Column()
  completed: Boolean

  @OneToOne(() => User)
  @JoinColumn()
  user: User
}
