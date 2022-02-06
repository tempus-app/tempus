import { ChildEntity, Column } from 'typeorm'
import { User } from './user.entity'

@ChildEntity()
export class Resource extends User {
  @Column({ nullable: true })
  phoneNumber: string

  @Column({ nullable: true })
  location: string

  @Column({ nullable: true })
  title: string
}
