import { SlimResourceDto } from '../../account-dtos/resource/slimResource.dto'
import { SlimExperienceDto } from './slimExperience.dto'

export class FullExperienceDto extends SlimExperienceDto {
  constructor(resource?: SlimResourceDto) {
    super()
  }
}
