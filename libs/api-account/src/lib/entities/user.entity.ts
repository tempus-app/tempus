import { Entity, Column, PrimaryGeneratedColumn, TableInheritance, OneToMany } from 'typeorm'
import { ViewEntity } from 'libs/api-profile/src'
import { User } from '../models/user.model'

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

  @Column()
  roles: string

  @OneToMany(() => ViewEntity, (view) => view.user)
  views: ViewEntity[]
}
