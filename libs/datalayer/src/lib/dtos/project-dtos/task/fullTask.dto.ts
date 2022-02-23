import { CreateProjectDto } from '../project/createProject.dto'
import { SlimTaskDto } from './slimTask.dto'

export class FullTaskDto extends SlimTaskDto {
  constructor(projects: CreateProjectDto) {
    super()
  }
}
