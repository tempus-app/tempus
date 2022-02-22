import { OmitType, PartialType } from '@nestjs/swagger'
import { CreateLocationDto } from '.'

export class UpdateLocationDto extends PartialType(CreateLocationDto) {}
