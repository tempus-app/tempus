import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Location } from '../models/location.model'

@Entity()
export class LocationEntity implements Location {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  city: string

  @Column()
  province: string

  @Column()
  country: string
}
