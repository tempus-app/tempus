import { ResourceDto } from '../../account-dtos/resource/resource.dto'
import { EducationDto } from './education.dto'
export class GetEducationDto extends EducationDto {
  constructor(resource?: ResourceDto) {
    super()
  }
}
