import { ResourceEntity } from '../../..'
import { RoleType } from '../../../enums'
import { SlimUserDto } from '../user/slimUser.dto'
export class SlimResourceDto extends SlimUserDto {
  phoneNumber: string
  title: string

  constructor(
    id?: number,
    phoneNumber?: string,
    title?: string,
    firstName?: string,
    lastName?: string,
    email?: string,
    password?: string,
    roles?: RoleType[],
  ) {
    super(id, firstName, lastName, email, password, roles)
    this.phoneNumber = phoneNumber ?? null
    this.title = title ?? null
  }

  public static toEntity(dto: SlimResourceDto): ResourceEntity {
    if (dto == null) return new ResourceEntity()
    let resEntity = new ResourceEntity(
      dto.id,
      dto.phoneNumber,
      dto.title,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      dto.firstName,
      dto.lastName,
      dto.email,
      dto.password,
      dto.roles,
    )
    return resEntity
  }

  public static fromEntity(entity: ResourceEntity): SlimResourceDto {
    if (entity == null) return new SlimResourceDto()
    return new SlimResourceDto(
      entity.id,
      entity.phoneNumber,
      entity.title,
      entity.firstName,
      entity.lastName,
      entity.email,
      entity.password,
      entity.roles,
    )
  }
}
