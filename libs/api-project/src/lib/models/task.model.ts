import { ProjectEntity } from '..'
import { Project } from './project.model'

export class Task {
  id: number
  taskName: string
  project: ProjectEntity[]
}
