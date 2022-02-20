import { StatusType } from './status'
import { User } from './user.model'

export interface Link {
  id?: number
  expiry: Date
  firstName: string
  lastName: string
  status: StatusType
  token: string
  user?: User
}
