import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateLinkDto } from '.'

export class UpdatelinkDto extends PartialType(CreateLinkDto) {
  @ApiProperty()
  id: number
  constructor(id: number) {
    super()
    this.id = id
  }
}
