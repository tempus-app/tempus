import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateEducationDto } from '.';
import { UpdateLocationDto } from '../..';

export class UpdateEducationDto extends PartialType(
  OmitType(CreateEducationDto, ['location'] as const),
) {
  @ApiProperty()
  id: number;

  @ApiProperty()
  location: UpdateLocationDto;

  constructor(id: number, location: UpdateLocationDto) {
    super();
    this.id = id;
    this.location = location;
  }
}
