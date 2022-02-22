import { SlimLocationDto } from '../..'
import { EducationEntity } from '../../../entities'
import { SlimResourceDto } from '../../account-dtos/resource/slimResource.dto'
import { SlimEducationDto } from './slimEducation.dto'
export class FullEducationDto extends SlimEducationDto {
  resource: SlimResourceDto
  location: SlimLocationDto

  constructor(resource?: SlimResourceDto, location?: SlimLocationDto) {
    super()
    this.resource = resource
    this.location = location
  }
  public static fromEntity(entity: EducationEntity): FullEducationDto {
    if (entity == null) return new FullEducationDto()

    let fullEducationDto = <FullEducationDto>SlimEducationDto.fromEntity(entity)
    fullEducationDto.resource = SlimResourceDto.fromEntity(entity.resource)
    fullEducationDto.location = SlimLocationDto.fromEntity(entity.location)

    return fullEducationDto
  }
}
