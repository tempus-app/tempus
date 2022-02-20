import { ClientDto } from '../client/client.dto'
import { TaskDto } from '../task/task.dto'
import { ProjectDto } from './project.dto'

export class GetProjectDto extends ProjectDto {
  constructor(client?: ClientDto, tasks?: TaskDto[]) {
    super()
  }
}
