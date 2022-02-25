import { RoleType } from '../../../enums'
import { ApiProperty } from '@nestjs/swagger'
import { UserEntity } from '../../../entities/account-entities/user.entity'
import { IsOptional } from 'class-validator'
import { LocationEntity, ResourceEntity } from '../../..'
import { UpdateLocationDto } from '../..'

export class UpdateUserDto {
  @ApiProperty()
  id: number

  @ApiProperty()
  firstName: string

  @ApiProperty()
  lastName: string

  @ApiProperty()
  email: string

  @ApiProperty()
  @IsOptional()
  location?: UpdateLocationDto

  @ApiProperty({ enum: ['ASSIGNED_RESOURCE', 'AVAILABLE_RESOURCE', 'BUSINESS_OWNER', 'SUPERVISOR'] })
  roles: RoleType[]

  @ApiProperty()
  @IsOptional()
  phoneNumber?: string

  @ApiProperty()
  @IsOptional()
  title?: string

  constructor(
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    roles: RoleType[],
    location?: UpdateLocationDto,
    phoneNumber?: string,
    title?: string,
  ) {
    this.id = id
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.roles = roles
    this.phoneNumber = phoneNumber ? phoneNumber : null
    this.title = title ? title : null
    this.location = location
  }

  public static toEntity(dto: UpdateUserDto): UserEntity {
    if (dto == null) return new UserEntity()
    if (dto) {
      return new ResourceEntity(
        dto.id,
        dto.phoneNumber,
        dto.title,
        UpdateLocationDto.toEntity(dto.location),
        null,
        null,
        null,
        null,
        null,
        null,
        dto.firstName,
        dto.lastName,
        dto.email,
        null,
        dto.roles,
      )
    }
    return new UserEntity(null, dto.firstName, dto.lastName, dto.email, null, dto.roles)
  }
}
