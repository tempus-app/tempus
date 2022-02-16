import { StatusType } from './status'
import { User } from './user.model'

export interface Link {
  id: number
  firstName: string
  lastName: string
  status: StatusType
  token: string
  user?: User
}
