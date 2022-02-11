import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, ManyToOne } from 'typeorm'
import { Education } from '../models/education.model'

@Entity()
export class EducationEntity implements Education {
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
