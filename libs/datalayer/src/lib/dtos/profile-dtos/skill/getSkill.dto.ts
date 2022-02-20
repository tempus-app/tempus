import { ResourceDto } from '../../account-dtos/resource/resource.dto'
import { SkillDto } from './skill.dto'

export class GetSkillDto extends SkillDto {
  constructor(resource?: ResourceDto) {
    super()
  }
}
