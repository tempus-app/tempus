import { User } from './user.model'
import { Project } from '@tempus/api-project'
import { View, Experience, Education, Skill, Certification } from '@tempus/api-profile'
import { Location } from '@tempus/api-common'

export interface Resource extends User {
  phoneNumber: string
  location: Location
  title: string
  projects?: Project[]
  views?: View[]
  experiences?: Experience[]
  educations?: Education[]
  skills?: Skill[]
  certifications?: Certification[]
}
