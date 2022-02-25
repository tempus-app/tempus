import { Entity, Column, PrimaryGeneratedColumn, TableInheritance, OneToMany } from 'typeorm'
import { User } from '../..'
import { RoleType } from '../../enums'

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'user_type' } })
export class UserEntity implements User {
  constructor(
    id?: number,
    firstName?: string,
    lastName?: string,
    email?: string,
    password?: string,
    roles?: RoleType[],
  ) {
    this.id = id
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.password = password
    this.roles = roles
  }
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  firstName: string

  @Column({ nullable: true })
  lastName: string

  @Column({ nullable: true })
  email: string

  @Column({ nullable: true })
  password: string

  @Column({
    type: 'enum',
    enum: RoleType,
    array: true,
    default: [RoleType.USER],
  })
  roles: RoleType[]
}
