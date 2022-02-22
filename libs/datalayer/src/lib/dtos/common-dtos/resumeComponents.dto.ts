import { SlimCertificationDto, SlimEducationDto, SlimExperienceDto, SlimResourceDto, SlimSkillDto } from '..'

export class ResumeComponentsDto {
  educations: SlimEducationDto[]
  experiences: SlimExperienceDto[]
  skills: SlimSkillDto[]
  certifications: SlimCertificationDto[]

  constructor(
    educations?: SlimEducationDto[],
    experiences?: SlimExperienceDto[],
    skills?: SlimSkillDto[],
    certifications?: SlimCertificationDto[],
  ) {
    this.educations = educations
    this.experiences = experiences
    this.certifications = certifications
    this.skills = skills
  }
}
