import { ResourceDto } from '../../account-dtos/resource/resource.dto'
import { CertificationDto } from './certification.dto'

export class GetCertificationDto extends CertificationDto {
  constructor(resource?: ResourceDto) {
    super()
  }
}
