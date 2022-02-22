import { LocationEntity } from '../..'

export class LocationDto {
  id?: number
  city?: string
  province?: string
  country?: string

  constructor(id?: number, city?: string, province?: string, country?: string) {
    this.id = id ?? null
    this.city = city ?? null
    this.province = province ?? null
    this.country = country ?? null
  }

  public static toEntity(dto: LocationDto): LocationEntity {
    if (dto == null) return new LocationEntity()
    return new LocationEntity(dto.id, dto.city, dto.province, dto.city)
  }
  public static fromEntity(entity: LocationEntity): LocationDto {
    if (entity == null) return new LocationDto()
    return new LocationDto(entity.id, entity.city, entity.province, entity.country)
  }
}
