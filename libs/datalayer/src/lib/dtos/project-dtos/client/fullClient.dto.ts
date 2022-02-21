import { SlimProjectDto } from '../project/slimProject.dto'
import { SlimClientDto } from './slimClient.dto'

export class GetClientDto extends SlimClientDto {
  constructor(projects?: SlimProjectDto[]) {
    super()
  }
}
