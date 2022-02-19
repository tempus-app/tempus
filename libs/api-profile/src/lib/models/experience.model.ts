import { Location } from '@tempus/api-common'

export interface Experience {
  id: number
  title: string
  description: string
  startDate: Date
  endDate: Date
  location: Location
}
