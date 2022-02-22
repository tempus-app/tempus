import { SlimLocationDto } from '../..'
import { ExperienceEntity } from '../../..'
import { SlimResourceDto } from '../../account-dtos/resource/slimResource.dto'
import { SlimExperienceDto } from './slimExperience.dto'

export class FullExperienceDto extends SlimExperienceDto {
  resource: SlimResourceDto
  location: SlimLocationDto

  constructor(resource?: SlimResourceDto, location?: SlimLocationDto) {
    super()
    this.resource = resource
    this.location = location
  }

  public static fromEntity(entity: ExperienceEntity): FullExperienceDto {
    if (entity == null) return new FullExperienceDto()

    let fullExperienceDto = <FullExperienceDto>SlimExperienceDto.fromEntity(entity)
    fullExperienceDto.resource = SlimResourceDto.fromEntity(entity.resource)
    fullExperienceDto.location = SlimLocationDto.fromEntity(entity.location)

    return fullExperienceDto
  }
}
