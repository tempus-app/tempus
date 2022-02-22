import { SlimUserDto } from '../user/slimUser.dto'
import { SlimLinkDto } from './slimLink.dto'

export class FullLinkDto extends SlimLinkDto {
  constructor(user?: SlimUserDto) {
    super()
  }
}
