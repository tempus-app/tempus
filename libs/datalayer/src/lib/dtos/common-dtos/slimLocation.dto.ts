import { LocationEntity } from '../..'

export class SlimLocationDto {
  id: number
  city: string
  province: string
  country: string

  constructor(id?: number, city?: string, province?: string, country?: string) {
    this.id = id ?? null
    this.city = city ?? null
    this.province = province ?? null
    this.country = country ?? null
  }

  public static toEntity(dto: SlimLocationDto): LocationEntity {
    if (dto == null) return new LocationEntity()
    return new LocationEntity(dto.id, dto.city, dto.province, dto.city)
  }
  public static fromEntity(entity: LocationEntity): SlimLocationDto {
    if (entity == null) return new SlimLocationDto()
    return new SlimLocationDto(entity.id, entity.city, entity.province, entity.country)
  }
}
