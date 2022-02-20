import { Resource } from '../account-models'

export interface Certification {
  id?: number
  title: string
  institution: string
  resource?: Resource
}
