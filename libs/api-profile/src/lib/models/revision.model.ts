import { View } from './view.model'

export interface Revision {
  id: number
  section: string
  approved: boolean
  view: View
}
