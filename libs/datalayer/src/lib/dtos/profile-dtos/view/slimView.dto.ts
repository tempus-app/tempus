import { SlimExperienceDto } from '../experience/slimExperience.dto'
import { SlimSkillDto } from '../skill/slimSkill.dto'
import { SlimEducationDto } from '../education/slimEducation.dto'
import { ViewType } from '../../../enums'

export class SlimViewDto {
  constructor(
    id?: number,
    type?: string,
    skills?: SlimSkillDto[],
    experiences?: SlimExperienceDto[],
    educations?: SlimEducationDto[],
    viewType?: ViewType,
  ) {}
}
