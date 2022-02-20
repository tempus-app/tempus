import { Resource } from '../account-models'
import { Location } from '../common-models'

export interface Experience {
  id?: number
  title: string
  description: string
  startDate: Date
  endDate: Date
  location: Location
  resource?: Resource
}
