import { ResourceDto } from '../../account-dtos/resource/resource.dto'
import { ExperienceDto } from './experience.dto'

export class GetExperienceDto extends ExperienceDto {
  constructor(resource?: ResourceDto) {
    super()
  }
}
