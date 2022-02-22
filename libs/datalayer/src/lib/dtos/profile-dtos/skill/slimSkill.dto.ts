import { SkillEntity } from '../../..'
import { FullSkillTypeDto } from './fullSkillType.dto'

export class SlimSkillDto {
  id: number
  skill: FullSkillTypeDto
  level: number
  constructor(id?: number, skill?: FullSkillTypeDto, level?: number) {
    this.id = id
    this.skill = skill
    this.level = level
  }

  public static toEntity(dto: SlimSkillDto): SkillEntity {
    if (dto == null) return new SkillEntity()
    return new SkillEntity(dto.id, FullSkillTypeDto.toEntity(dto.skill), dto.level)
  }

  public static fromEntity(entity: SkillEntity): SlimSkillDto {
    if (entity == null) return new SlimSkillDto()
    return new SlimSkillDto(entity.id, FullSkillTypeDto.fromEntity(entity.skill), entity.level)
  }
}
