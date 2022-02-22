import { User } from '..'
import { ResumeSectionType } from '../../enums'
import { View } from './view.model'

export interface Revision {
  id: number
  createdAt: Date
  approvedAt: Date
  sectionsChanged: ResumeSectionType[]
  approver: User
  approved: boolean
  view: View
}
