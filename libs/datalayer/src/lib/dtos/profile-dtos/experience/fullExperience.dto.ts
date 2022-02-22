import { ExperienceEntity } from '../../..'
import { SlimResourceDto } from '../../account-dtos/resource/slimResource.dto'
import { SlimExperienceDto } from './slimExperience.dto'

export class FullExperienceDto extends SlimExperienceDto {
  resource?: SlimResourceDto
  constructor(resource?: SlimResourceDto) {
    super()
    this.resource = resource
  }

  public static fromEntity(entity: ExperienceEntity): FullExperienceDto {
    if (entity == null) return new FullExperienceDto()

    let fullExperienceDto = <FullExperienceDto>SlimExperienceDto.fromEntity(entity)
    fullExperienceDto.resource = SlimResourceDto.fromEntity(entity.resource)

    return fullExperienceDto
  }
}
