import { SlimProjectDto } from '../project/slimProject.dto'
import { SlimTaskDto } from './slimTask.dto'

export class FullTaskDto extends SlimTaskDto {
  constructor(projects: SlimProjectDto) {
    super()
  }
}
