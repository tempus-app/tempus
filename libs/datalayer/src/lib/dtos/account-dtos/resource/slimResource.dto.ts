import { ResourceEntity } from '../../..'
import { RoleType } from '../../../enums'
import { LocationDto } from '../../common-dtos/location.dto'
import { SlimUserDto } from '../user/slimUser.dto'
export class SlimResourceDto extends SlimUserDto {
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
  public static fromEntity(entity: ResourceEntity): SlimResourceDto {
    if (entity == null) return new SlimResourceDto()
    return new SlimResourceDto(
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
