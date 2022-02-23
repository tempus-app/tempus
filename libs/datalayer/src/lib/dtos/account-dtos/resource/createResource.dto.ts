import { ApiProperty } from '@nestjs/swagger'
import { ResourceEntity } from '../../..'
import { RoleType } from '../../../enums'
import { CreateUserDto } from '../user/createUser.dto'
export class CreateResourceDto extends CreateUserDto {
  @ApiProperty()
  phoneNumber: string

  @ApiProperty()
  title: string

  constructor(
    phoneNumber: string,
    title: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    roles: RoleType[],
  ) {
    super(firstName, lastName, email, password, roles)
    this.phoneNumber = phoneNumber ?? null
    this.title = title ?? null
  }

  public static toEntity(dto: CreateResourceDto): ResourceEntity {
    if (dto == null) return new ResourceEntity()
    let resEntity = new ResourceEntity(
      null,
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
}
