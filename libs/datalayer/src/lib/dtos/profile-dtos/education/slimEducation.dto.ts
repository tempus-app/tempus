import { EducationEntity } from '../../..'

export class SlimEducationDto {
  id: number
  degree: string
  institution: string
  startDate: Date
  endDate: Date

  constructor(id?: number, degree?: string, institution?: string, startDate?: Date, endDate?: Date) {
    this.id = id ?? null
    this.degree = degree ?? null
    this.institution = institution ?? null
    this.startDate = startDate ?? null
    this.endDate = endDate ?? null
  }

  public static toEntity(dto: SlimEducationDto): EducationEntity {
    if (dto == null) return new EducationEntity()
    return new EducationEntity(dto.id, dto.degree, dto.institution, dto.startDate, dto.endDate)
  }

  public static fromEntity(entity: EducationEntity): SlimEducationDto {
    if (entity == null) return new SlimEducationDto()
    return new SlimEducationDto(entity.id, entity.degree, entity.institution, entity.startDate, entity.endDate)
  }
}
