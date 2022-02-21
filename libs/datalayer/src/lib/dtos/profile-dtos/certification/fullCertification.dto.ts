import { SlimResourceDto } from '../../account-dtos/resource/slimResource.dto'
import { SlimCertificationDto } from './slimCertification.dto'

export class FullCertificationDto extends SlimCertificationDto {
  constructor(resource?: SlimResourceDto) {
    super()
  }
}
