import { EducationEntity } from '../../../entities'
import { SlimResourceDto } from '../../account-dtos/resource/slimResource.dto'
import { SlimEducationDto } from './slimEducation.dto'
export class FullEducationDto extends SlimEducationDto {
  resource?: SlimResourceDto
  constructor(resource?: SlimResourceDto) {
    super()
    this.resource = resource
  }
  public static fromEntity(entity: EducationEntity): FullEducationDto {
    if (entity == null) return new FullEducationDto()

    let fullEducationDto = <FullEducationDto>SlimEducationDto.fromEntity(entity)
    fullEducationDto.resource = SlimResourceDto.fromEntity(entity.resource)

    return fullEducationDto
  }
}
