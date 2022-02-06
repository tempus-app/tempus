import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, ManyToOne } from 'typeorm'

@Entity()
export class Education {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  degree: string

  @Column()
  institution: string

  @Column()
  startDate: Date

  @Column()
  endDate: Date
}
