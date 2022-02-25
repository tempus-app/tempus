import { OmitType, PartialType } from '@nestjs/swagger'
import { CreateLocationDto } from '.'
import { LocationEntity } from '../..'

export class UpdateLocationDto extends PartialType(CreateLocationDto) {
  public static toEntity(dto: UpdateLocationDto) {
    return CreateLocationDto.toEntity(dto as CreateLocationDto)
  }
}
