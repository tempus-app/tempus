import { EducationEntity } from '../../../entities'
import { ResourceDto } from '../../account-dtos/resource/resource.dto'
import { EducationDto } from './education.dto'
export class GetEducationDto extends EducationDto {
  resource?: ResourceDto
  constructor(resource?: ResourceDto) {
    super()
    this.resource = resource
  }
  public static fromEntity(entity: EducationEntity): GetEducationDto {
    if (entity == null) return new GetEducationDto()

    let getEducationDto = <GetEducationDto>EducationDto.fromEntity(entity)
    getEducationDto.resource = ResourceDto.fromEntity(entity.resource)

    return getEducationDto
  }
}
