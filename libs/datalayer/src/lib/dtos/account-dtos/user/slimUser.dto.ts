import { APP_ID } from '@angular/core'
import { RoleType } from '../../../enums'
import { ApiProperty } from '@nestjs/swagger'

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

  @ApiProperty({ enum: ['ASSIGNED_RESOURCE', 'AVAILABLE_RESOURCE', 'BUSINESS_OWNER', 'SUPERVISOR']})
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
}
