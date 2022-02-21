import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { StatusType } from '../../enums'
import { UserEntity } from './user.entity'

@Entity()
export class LinkEntity {
  constructor(
    id?: number,
    createdAt?: Date,
    firstName?: string,
    lastName?: string,
    expiry?: Date,
    token?: string,
    status?: StatusType,
    user?: UserEntity,
  ) {
    this.id = id ?? null
    this.createdAt = createdAt ?? null
    this.firstName = firstName ?? null
    this.lastName = lastName ?? null
    this.expiry = expiry ?? null
    this.token = token ?? null
    this.status = status ?? null
    this.user = user ?? null
  }
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

  // public static fromDto(link: Link): LinkEntity {
  //   if (link == null || link == undefined) return new LinkEntity()
  //   return new LinkEntity(
  //     link.id,
  //     null,
  //     link.firstName,
  //     link.lastName,
  //     link.expiry,
  //     link.token,
  //     link.status,

  //   )
  // }
}
