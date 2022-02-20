import { ProjectDto } from '../project/project.dto'
import { ClientDto } from './client.dto'

export class GetClientDto extends ClientDto {
  constructor(projects?: ProjectDto[]) {
    super()
  }
}
