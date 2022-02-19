import { Location } from '@tempus/api-common'

export interface Education {
  id: number
  degree: string
  institution: string
  startDate: Date
  endDate: Date
  location: Location
}
