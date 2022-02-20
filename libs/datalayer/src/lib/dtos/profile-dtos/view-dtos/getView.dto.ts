import { ResourceDto } from '../../account-dtos/resource/resource.dto'
import { RevisionDto } from '../revision/revision.dto'
import { ViewDto } from './view.dto'

export class GetViewDto extends ViewDto {
  constructor(status?: RevisionDto[], resource?: ResourceDto) {
    super()
  }
}
