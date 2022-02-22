import { SlimClientDto } from '../client/slimClient.dto'
import { SlimTaskDto } from '../task/slimTask.dto'
import { SlimProjectDto } from './slimProject.dto'

export class FullProjectDto extends SlimProjectDto {
  constructor(client?: SlimClientDto, tasks?: SlimTaskDto[]) {
    super()
  }
}
