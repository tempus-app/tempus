import { RoleType } from '../../../enums'

export class UserDto {
  id: number
  firstName: string
  lastName: string
  email: string
  password: string
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
