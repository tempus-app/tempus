import { UserDto } from '../user/user.dto'
import { LinkDto } from './link.dto'

export class GetLinkDto extends LinkDto {
  constructor(user?: UserDto) {
    super()
  }
}
