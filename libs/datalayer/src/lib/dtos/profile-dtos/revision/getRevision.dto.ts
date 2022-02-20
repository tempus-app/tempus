import { ViewDto } from '../view-dtos/view.dto'
import { RevisionDto } from './revision.dto'
export class GetRevisionDto extends RevisionDto {
  constructor(createdAt?: Date, approvedAt?: Date, approved?: boolean, view?: ViewDto) {
    super()
  }
}
