import { RoleType } from '../../../enums'
import { ApiProperty } from '@nestjs/swagger'
import { UserEntity } from '../../../entities/account-entities/user.entity'

export class CreateUserDto {
  @ApiProperty()
  firstName: string

  @ApiProperty()
  lastName: string

  @ApiProperty()
  email: string

  @ApiProperty()
  password: string

  @ApiProperty({ enum: ['ASSIGNED_RESOURCE', 'AVAILABLE_RESOURCE', 'BUSINESS_OWNER', 'SUPERVISOR'] })
  roles: RoleType[]

  constructor(firstName: string, lastName: string, email: string, password: string, roles: RoleType[]) {
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.password = password
    this.roles = roles
  }

  public static toEntity(dto: CreateUserDto): UserEntity {
    if (dto == null) return new UserEntity()
    return new UserEntity(null, dto.firstName, dto.lastName, dto.email, dto.password, dto.roles)
  }
}
