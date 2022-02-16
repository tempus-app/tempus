import { ClientEntity, TaskEntity } from '..'
import { Client } from './client.model'
import { Task } from './task.model'

export class Project {
  id: number
  name: string
  startDate: Date
  endDate: Date
  hoursPerDay: number
  client: ClientEntity
  tasks?: TaskEntity[]
}
