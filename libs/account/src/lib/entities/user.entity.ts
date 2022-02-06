import { Entity, Column, PrimaryGeneratedColumn, TableInheritance } from 'typeorm'

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'role' } })
export class User {
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
}
