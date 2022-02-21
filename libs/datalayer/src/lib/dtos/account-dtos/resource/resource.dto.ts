import { ResourceEntity, RoleType } from '../../..'
import { LocationDto } from '../../common-dtos/location.dto'
import { UserDto } from '../user/user.dto'
export class ResourceDto extends UserDto {
  phoneNumber: string
  title: string
  location: LocationDto

  constructor(
    phoneNumber?: string,
    title?: string,
    location?: LocationDto,
    id?: number,
    firstName?: string,
    lastName?: string,
    email?: string,
    password?: string,
    roles?: RoleType[],
  ) {
    super(id, firstName, lastName, email, password, roles)
    this.phoneNumber = phoneNumber ?? null
    this.title = title ?? null
    this.location = location ?? null
  }
  public static fromEntity(entity: ResourceEntity): ResourceDto {
    if (entity == null) return new ResourceDto()
    return new ResourceDto(
      entity.phoneNumber,
      entity.title,
      LocationDto.fromEntity(entity.location),
      entity.id,
      entity.firstName,
      entity.lastName,
      entity.email,
      entity.password,
      entity.roles,
    )
  }
}
