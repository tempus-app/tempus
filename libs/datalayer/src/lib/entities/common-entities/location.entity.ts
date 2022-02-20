import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Location } from '../../models/common-models'

@Entity()
export class LocationEntity implements Location {
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

  // public static fromDto(location: Location): LocationEntity {
  //   if (location == null || location == undefined) return new LocationEntity()
  //   return new LocationEntity(location.id, location.city, location.province, location.country)
  // }
}
