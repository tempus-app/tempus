import { SlimResourceDto } from '../../account-dtos/resource/slimResource.dto'
import { SlimSkillDto } from './slimSkill.dto'

export class FullSkillDto extends SlimSkillDto {
  constructor(resource?: SlimResourceDto) {
    super()
  }
}
