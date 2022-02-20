import { CertificationDto } from '../../profile-dtos/certification/certification.dto'
import { EducationDto } from '../../profile-dtos/education/education.dto'
import { ExperienceDto } from '../../profile-dtos/experience/experience.dto'
import { SkillDto } from '../../profile-dtos/skill/skill.dto'
import { ViewDto } from '../../profile-dtos/view-dtos/view.dto'
import { ProjectDto } from '../../project-dtos/project/project.dto'
import { ResourceDto } from './resource.dto'
export class GetResourceDto extends ResourceDto {
  constructor(
    projects?: ProjectDto[],
    views?: ViewDto[],
    experiences?: ExperienceDto[],
    educations?: EducationDto[],
    skills?: SkillDto[],
    certifications?: CertificationDto[],
  ) {
    super()
  }
}
