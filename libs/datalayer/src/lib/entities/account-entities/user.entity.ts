import { Entity, Column, PrimaryGeneratedColumn, TableInheritance, OneToMany } from 'typeorm'
import { RoleType } from '../../enums'

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'role' } })
export class UserEntity {
  constructor(
    id?: number,
    firstName?: string,
    lastName?: string,
    email?: string,
    password?: string,
    roles?: RoleType[],
  ) {
    this.id = id ?? null
    this.firstName = firstName ?? null
    this.lastName = lastName ?? null
    this.email = email ?? null
    this.password = password ?? null
    this.roles = roles ?? null
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
    default: [RoleType.AVAILABLE_RESOURCE],
  })
  roles: RoleType[]
}
