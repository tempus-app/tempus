import { User } from './user.model';

export interface Link {
  id: number

  expiry: Date
  completed: Boolean

  user: User
}
