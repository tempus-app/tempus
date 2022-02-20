import { RoleType } from '../../../models/account-models'
export class UserDto {
  constructor(
    id?: number,
    firstName?: string,
    lastName?: string,
    email?: string,
    password?: string,
    roles?: RoleType[],
  ) {}
}
