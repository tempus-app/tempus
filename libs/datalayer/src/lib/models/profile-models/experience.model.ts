import { Resource } from '..'
import { Location } from '../common-models'

export interface Experience {
  id: number
  title: string
  company: string
  description: string[]
  startDate: Date
  endDate: Date
  location: Location
  resource: Resource
}
