import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, ManyToOne } from 'typeorm'
import { Experience } from '../models/experience.model'
import { ViewEntity } from './view.entity'

@Entity()
export class ExperienceEntity implements Experience {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  startDate: Date

  @Column()
  endDate: Date
}
