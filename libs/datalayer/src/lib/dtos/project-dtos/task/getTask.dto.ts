import { ProjectDto } from '../project/project.dto'
import { TaskDto } from './task.dto'

export class GetTaskDto extends TaskDto {
  constructor(projects: ProjectDto) {
    super()
  }
}
