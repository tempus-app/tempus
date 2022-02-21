import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class LocationEntity {
  constructor(id?: number, city?: string, province?: string, country?: string) {
    this.id = id ?? null
    this.city = city ?? null
    this.province = province ?? null
    this.country = country ?? null
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  city: string

  @Column()
  province: string

  @Column()
  country: string
}
