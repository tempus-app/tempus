import { Location } from '../../../models/common-models'
import { UserDto } from '../user/user.dto'
export class ResourceDto extends UserDto {
  constructor(phoneNumber?: string, title?: string, location?: Location) {
    super()
  }
}
