import { StatusType } from '../../enums'
import { User } from './user.model'

export interface Link {
  id?: number
  createdAt?: Date
  firstName?: string
  lastName?: string
  expiry?: Date
  token?: string
  status?: StatusType
  user?: User
}
