import { SlimCertificationDto, SlimEducationDto, SlimLocationDto } from '../..'
import { ResourceEntity } from '../../..'
import { SlimExperienceDto } from '../../profile-dtos/experience/slimExperience.dto'
import { SlimSkillDto } from '../../profile-dtos/skill/slimSkill.dto'
import { SlimViewDto } from '../../profile-dtos/view/slimView.dto'
import { SlimProjectDto } from '../../project-dtos/project/slimProject.dto'
import { SlimResourceDto } from './slimResource.dto'

export class FullResourceDto extends SlimResourceDto {
  projects: SlimProjectDto[]
  views: SlimViewDto[]
  experiences: SlimExperienceDto[]
  educations: SlimEducationDto[]
  skills: SlimSkillDto[]
  certifications: SlimCertificationDto[]
  location: SlimLocationDto

  constructor(
    projects?: SlimProjectDto[],
    views?: SlimViewDto[],
    experiences?: SlimExperienceDto[],
    educations?: SlimEducationDto[],
    skills?: SlimSkillDto[],
    certifications?: SlimCertificationDto[],
    location?: SlimLocationDto,
  ) {
    super()
    this.projects = projects
    this.views = views
    this.educations = educations
    this.experiences = experiences
    this.skills = skills
    this.certifications = certifications
    this.location = location
  }

  public static fromEntity(entity: ResourceEntity): FullResourceDto {
    if (entity == null) return new FullResourceDto()

    const fullResourceDto = <FullResourceDto>SlimResourceDto.fromEntity(entity)
    fullResourceDto.certifications = entity.certifications.map((certEntity) =>
      SlimCertificationDto.fromEntity(certEntity),
    )
    fullResourceDto.educations = entity.educations.map((eduEntity) => SlimEducationDto.fromEntity(eduEntity))
    fullResourceDto.experiences = entity.experiences.map((expEntity) => SlimExperienceDto.fromEntity(expEntity))
    fullResourceDto.skills = entity.skills.map((skillEntity) => SlimSkillDto.fromEntity(skillEntity))
    fullResourceDto.location = SlimLocationDto.fromEntity(entity.location)
    // ADD PROJECTS
    // ADD VIEWS

    return fullResourceDto
  }
}
