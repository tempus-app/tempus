import { ApiProperty } from '@nestjs/swagger'
import { ExperienceEntity } from '../../..'
import { CreateLocationDto } from '../../common-dtos'
export class CreateExperienceDto {
  @ApiProperty()
  title: string

  @ApiProperty()
  description: string

  @ApiProperty()
  startDate: Date

  @ApiProperty()
  endDate: Date

  @ApiProperty()
  location: CreateLocationDto

  constructor(title: string, description: string, startDate: Date, endDate: Date, location: CreateLocationDto) {
    this.title = title
    this.description = description
    this.startDate = startDate
    this.endDate = endDate
    this.location = location
  }

  public static toEntity(dto: CreateExperienceDto): ExperienceEntity {
    if (dto == null) return new ExperienceEntity()
    return new ExperienceEntity(
      null,
      dto.title,
      dto.description,
      dto.startDate,
      dto.endDate,
      CreateLocationDto.toEntity(dto.location),
    )
  }
}
