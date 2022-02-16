import { User } from './user.model'
import { Project } from '@tempus/api-project'
import { View } from '@tempus/api-profile'

export interface Resource extends User {
  phoneNumber: string
  location: string
  title: string
  projects?: Project[]
  views?: View[]
}
