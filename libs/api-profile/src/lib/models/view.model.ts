import { User, Resource } from '@tempus/api-account'
import { Education } from './education.model'
import { Experience } from './experience.model'
import { Revision } from './revision.model'
import { Skill } from './skill.model'

export interface View {
  id: number
  type: string
  status?: Revision[]
  skills?: Skill[]
  experience?: Experience[]
  education?: Education[]
  user: User
  resource: Resource
}
