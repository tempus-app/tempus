import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, ManyToOne } from 'typeorm'
import { View } from './view.entity'

@Entity()
export class Experience {
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
