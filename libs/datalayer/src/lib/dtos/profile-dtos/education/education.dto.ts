import { EducationEntity } from '../../..'
import { LocationDto } from '../../common-dtos/location.dto'

export class EducationDto {
  id: number
  degree: string
  institution: string
  startDate: Date
  endDate: Date
  location: LocationDto

  constructor(
    id?: number,
    degree?: string,
    institution?: string,
    startDate?: Date,
    endDate?: Date,
    location?: LocationDto,
  ) {
    this.id = id ?? null
    this.degree = degree ?? null
    this.institution = institution ?? null
    this.startDate = startDate ?? null
    this.endDate = endDate ?? null
    this.location = location ?? null
  }

  public static toEntity(dto: EducationDto): EducationEntity {
    if (dto == null) return new EducationEntity()
    return new EducationEntity(
      dto.id,
      dto.degree,
      dto.institution,
      dto.startDate,
      dto.endDate,
      LocationDto.toEntity(dto.location),
    )
  }

  public static fromEntity(entity: EducationEntity): EducationDto {
    if (entity == null) return new EducationDto()
    return new EducationDto(
      entity.id,
      entity.degree,
      entity.institution,
      entity.startDate,
      entity.endDate,
      LocationDto.fromEntity(entity.location),
    )
  }
}
