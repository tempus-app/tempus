import { APP_ID } from '@angular/core'
import { RoleType } from '../../../enums'
import { ApiProperty } from '@nestjs/swagger'
import { UserEntity } from '../../..'
import { SlimLocationDto } from '../..'

export class SlimUserDto {
  id: number

  @ApiProperty()
  firstName: string

  @ApiProperty()
  lastName: string

  @ApiProperty()
  email: string

  @ApiProperty()
  password: string

  @ApiProperty()
  location?: SlimLocationDto

  @ApiProperty({ enum: ['ASSIGNED_RESOURCE', 'AVAILABLE_RESOURCE', 'BUSINESS_OWNER', 'SUPERVISOR'] })
  roles: RoleType[]

  constructor(
    id?: number,
    firstName?: string,
    lastName?: string,
    email?: string,
    password?: string,
    roles?: RoleType[],
  ) {
    this.id = id ?? null
    this.firstName = firstName ?? null
    this.lastName = lastName ?? null
    this.email = email ?? null
    this.password = password ?? null
    this.roles = roles ?? null
  }

  public static toEntity(dto: SlimUserDto) {
    if (dto == null) return new UserEntity()
    return new UserEntity(dto.id, dto.email, dto.lastName, dto.email, dto.password, dto.roles)
  }

  public static fromEntity(entity: UserEntity) {
    if (entity == null) return new SlimUserDto()
    return new SlimUserDto(entity.id, entity.firstName, entity.lastName, entity.email, entity.password, entity.roles)
  }
}
