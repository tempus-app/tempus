import { ResumeSectionType } from './resumesectiontype'
import { View } from './view.model'

export interface Revision {
  id?: number
  sectionsChanged: ResumeSectionType[]
  approved: boolean
  view: View
}
