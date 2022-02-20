import { ExperienceDto } from '../experience/experience.dto'
import { SkillDto } from '../skill/skill.dto'
import { EducationDto } from '../education/education.dto'
import { ViewType } from '../../../models/profile-models'

export class ViewDto {
  constructor(
    id?: number,
    type?: string,
    skills?: SkillDto[],
    experiences?: ExperienceDto[],
    educations?: EducationDto[],
    viewType?: ViewType,
  ) {}
}
