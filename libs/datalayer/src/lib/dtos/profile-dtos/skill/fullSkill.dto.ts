import { SkillEntity } from '../../..'
import { SlimResourceDto } from '../../account-dtos/resource/slimResource.dto'
import { SlimSkillDto } from './slimSkill.dto'

export class FullSkillDto extends SlimSkillDto {
  resource: SlimResourceDto
  constructor(resource?: SlimResourceDto) {
    super()
    this.resource = resource
  }

  public static fromEntity(entity: SkillEntity): FullSkillDto {
    if (entity == null) return new FullSkillDto()

    let fullSkillDto = <FullSkillDto>SlimSkillDto.fromEntity(entity)
    fullSkillDto.resource = SlimResourceDto.fromEntity(entity.resource)

    return fullSkillDto
  }
}
