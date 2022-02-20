import { ViewDto } from '../view/view.dto'
import { RevisionDto } from './revision.dto'
export class GetRevisionDto extends RevisionDto {
  constructor(createdAt?: Date, approvedAt?: Date, approved?: boolean, view?: ViewDto) {
    super()
  }
}
