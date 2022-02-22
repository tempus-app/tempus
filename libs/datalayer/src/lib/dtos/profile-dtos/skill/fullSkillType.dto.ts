import { SkillTypeEntity } from '../../..'

export class FullSkillTypeDto {
  name: string
  constructor(name?: string) {
    this.name = name
  }

  public static toEntity(dto: FullSkillTypeDto): SkillTypeEntity {
    if (dto == null) return new SkillTypeEntity()
    return new SkillTypeEntity(dto.name)
  }

  public static fromEntity(entity: SkillTypeEntity): FullSkillTypeDto {
    if (entity == null) return new FullSkillTypeDto()
    return new FullSkillTypeDto(entity.name)
  }
}
