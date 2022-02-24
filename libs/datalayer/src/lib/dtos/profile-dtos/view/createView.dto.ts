import { CreateExperienceDto } from '../experience/createExperience.dto'
import { CreateSkillDto } from '../skill/createSkill.dto'
import { CreateEducationDto } from '../education/createEduation.dto'
import { ViewType } from '../../../enums'
import { ApiProperty } from '@nestjs/swagger'
import { ViewEntity } from '../../../entities/profile-entities/view.entity'
import { CreateSkillTypeDto } from '../skill/createSkillType.dto'

export class CreateViewDto {
  @ApiProperty()
  type: string

  @ApiProperty()
  skills: CreateSkillDto[]

  @ApiProperty()
  experiences: CreateExperienceDto[]

  @ApiProperty()
  educations: CreateEducationDto[]

  @ApiProperty({ enum: ['PRIMARY', 'SECONDARY'] })
  viewType: ViewType

  constructor(
    type: string,
    skills: CreateSkillDto[],
    experiences: CreateExperienceDto[],
    educations: CreateEducationDto[],
    viewType: ViewType,
  ) {
    this.type = type
    this.skills = skills
    this.experiences = experiences
    this.educations = educations
    this.viewType = viewType
  }

  public static toEntity(dto: CreateViewDto): ViewEntity {
    if (dto == null) return new ViewEntity()
    return new ViewEntity(null, dto.type, [], dto.skills, dto.experiences, dto.educations, null, dto.viewType)
  }
}
