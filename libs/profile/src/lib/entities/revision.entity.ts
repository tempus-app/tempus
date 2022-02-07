import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, ManyToOne } from 'typeorm'
import { View } from './view.entity'

@Entity()
export class Revision {
  @PrimaryGeneratedColumn()
  id: number

  // @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  // timestamp: Date

  @Column()
  section: string

  @Column()
  approved: boolean

  @ManyToOne(() => View, (view) => view.status)
  view: View
}
