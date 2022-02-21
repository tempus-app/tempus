import { SlimResourceDto } from '../../account-dtos/resource/slimResource.dto'
import { SlimRevisionDto } from '../revision/slimRevision.dto'
import { SlimViewDto } from './slimView.dto'

export class FullViewDto extends SlimViewDto {
  constructor(status?: SlimRevisionDto[], resource?: SlimResourceDto) {
    super()
  }
}
