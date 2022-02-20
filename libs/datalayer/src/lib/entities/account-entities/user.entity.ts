import { Entity, Column, PrimaryGeneratedColumn, TableInheritance, OneToMany } from 'typeorm'
import { RoleType, User } from '../../models/account-models'

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'role' } })
export class UserEntity implements User {
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
