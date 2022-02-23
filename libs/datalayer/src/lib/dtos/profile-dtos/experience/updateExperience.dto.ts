import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { CreateExperienceDto } from '.'
import { UpdateLocationDto } from '../../common-dtos'

export class UpdateExperienceDto extends PartialType(OmitType(CreateExperienceDto, ['location'] as const)) {
  @ApiProperty()
  id: number

  @ApiProperty()
  location: UpdateLocationDto

  constructor(id: number, location: UpdateLocationDto) {
    super()
    this.id = id
    this.location = location
  }
}
