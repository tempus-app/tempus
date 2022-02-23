import { CreateExperienceDto } from '../experience/createExperience.dto'
import { CreateSkillDto } from '../skill/createSkill.dto'
import { CreateEducationDto } from '../education/createEduation.dto'
import { ViewType } from '../../../enums'

export class CreateViewDto {
  constructor(
    type: string,
    skills: CreateSkillDto[],
    experiences: CreateExperienceDto[],
    educations: CreateEducationDto[],
    viewType: ViewType,
  ) {}
}
