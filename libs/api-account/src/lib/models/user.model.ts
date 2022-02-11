import { View } from '@tempus/api-profile';

export interface User {
  id: number

  firstName: string

  lastName: string

  email?: string

  password?: string

  // TODO: Authroization
  roles: string

  views?: View[]
}
