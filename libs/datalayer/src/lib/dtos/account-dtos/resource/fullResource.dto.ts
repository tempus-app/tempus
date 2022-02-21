import { SlimCertificationDto, SlimEducationDto } from '../..'
import { SlimExperienceDto } from '../../profile-dtos/experience/slimExperience.dto'
import { SlimSkillDto } from '../../profile-dtos/skill/slimSkill.dto'
import { SlimViewDto } from '../../profile-dtos/view/slimView.dto'
import { SlimProjectDto } from '../../project-dtos/project/slimProject.dto'
import { SlimResourceDto } from './slimResource.dto'

export class ResourceDtoFull extends SlimResourceDto {
  constructor(
    projects?: SlimProjectDto[],
    views?: SlimViewDto[],
    experiences?: SlimExperienceDto[],
    educations?: SlimEducationDto[],
    skills?: SlimSkillDto[],
    certifications?: SlimCertificationDto[],
  ) {
    super()
  }
}
