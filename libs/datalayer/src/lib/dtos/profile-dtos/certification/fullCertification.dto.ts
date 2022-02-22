import { CertificationEntity } from '../../..'
import { SlimResourceDto } from '../../account-dtos/resource/slimResource.dto'
import { SlimCertificationDto } from './slimCertification.dto'

export class FullCertificationDto extends SlimCertificationDto {
  resource: SlimResourceDto
  constructor(resource?: SlimResourceDto) {
    super()
    this.resource = resource
  }

  public static fromEntity(entity: CertificationEntity): FullCertificationDto {
    if (entity == null) return new FullCertificationDto()

    let fullCertificationDto = <FullCertificationDto>SlimCertificationDto.fromEntity(entity)
    fullCertificationDto.resource = SlimResourceDto.fromEntity(entity.resource)

    return fullCertificationDto
  }
}
