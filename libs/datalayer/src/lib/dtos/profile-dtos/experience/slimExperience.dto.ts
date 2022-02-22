import { ExperienceEntity } from '../../..'
import { LocationDto } from '../../common-dtos/location.dto'
export class SlimExperienceDto {

  id: number
  title: string
  description: string
  startDate: Date
  endDate: Date
  location: LocationDto

  constructor(
    id?: number,
    title?: string,
    description?: string,
    startDate?: Date,
    endDate?: Date,
    location?: LocationDto,
  ) {
    this.id = id
    this.title = title
    this.description = description
    this.startDate = startDate
    this.endDate = endDate
    this.location = location
  }

  public static toEntity(dto: SlimExperienceDto): ExperienceEntity {
    if (dto == null) return new ExperienceEntity()
    return new ExperienceEntity(
      dto.id,
      dto.title,
      dto.description,
      dto.startDate,
      dto.endDate,
      LocationDto.toEntity(dto.location)
    )
  }

  public static fromEntity(entity: ExperienceEntity): SlimExperienceDto {
    if (entity == null) return new SlimExperienceDto()
    return new SlimExperienceDto(
      entity.id,
      entity.title,
      entity.description,
      entity.startDate,
      entity.endDate,
      LocationDto.fromEntity(entity.location),
    )
  }
}
