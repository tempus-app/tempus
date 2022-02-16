import { ViewEntity } from '../entities/view.entity'
import { ResumeSectionType } from './resumesectiontype'

export interface Revision {
  id: number
  sectionsChanged: ResumeSectionType[]
  approved: boolean
  view: ViewEntity
}
