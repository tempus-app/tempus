import { SlimViewDto } from '../view/slimView.dto'
import { SlimRevisionDto } from './slimRevision.dto'
export class FullRevisionDto extends SlimRevisionDto {
  constructor(createdAt?: Date, approvedAt?: Date, approved?: boolean, view?: SlimViewDto) {
    super()
  }
}
