import { View } from '@tempus/api-profile';
import { RoleType } from '.';

export interface User {
  id: number

  firstName: string

  lastName: string

  email?: string

  password?: string

  // TODO: Authroization
  roles: RoleType[]

  views?: View[]
}
