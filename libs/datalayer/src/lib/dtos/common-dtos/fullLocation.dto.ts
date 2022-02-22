import { SlimEducationDto, SlimExperienceDto, SlimResourceDto } from '..'
import { LocationEntity } from '../..'
import { SlimLocationDto } from './slimLocation.dto'

export class FullLocationDto extends SlimLocationDto {
  experience: SlimExperienceDto
  resource: SlimResourceDto
  education: SlimEducationDto

  constructor(experience?: SlimExperienceDto, resource?: SlimResourceDto, education?: SlimEducationDto) {
    super()
    this.experience = experience
    this.resource = resource
    this.education = education
  }

  public static fromEntity(entity: LocationEntity): FullLocationDto {
    if (entity == null) return new FullLocationDto()
    let fullLocationDto = <FullLocationDto>SlimLocationDto.fromEntity(entity)
    fullLocationDto.experience = SlimExperienceDto.fromEntity(entity.experience)
    fullLocationDto.education = SlimEducationDto.fromEntity(entity.education)
    fullLocationDto.resource = SlimResourceDto.fromEntity(entity.resource)
    return fullLocationDto
  }
}
