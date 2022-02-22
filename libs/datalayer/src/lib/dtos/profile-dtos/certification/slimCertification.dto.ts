import { CertificationEntity } from '../../..'

export class SlimCertificationDto {
  id: number
  title: string
  institution: string

  constructor(id?: number, title?: string, institution?: string) {
    this.id = id
    this.title = title
    this.institution = institution
  }

  public static toEntity(dto: SlimCertificationDto): CertificationEntity {
    if (dto == null) return new CertificationEntity()
    return new CertificationEntity(dto.id, dto.title, dto.institution)
  }

  public static fromEntity(entity: CertificationEntity): SlimCertificationDto {
    if (entity == null) return new SlimCertificationDto()
    return new SlimCertificationDto(entity.id, entity.title, entity.institution)
  }
}
