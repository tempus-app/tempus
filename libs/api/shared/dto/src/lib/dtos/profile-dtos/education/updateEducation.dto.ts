import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IUpdateEducationDto } from '@tempus/shared-domain';
import { CreateEducationDto } from '.';
import { UpdateLocationDto } from '../../common-dtos';

export class UpdateEducationDto
	extends PartialType(OmitType(CreateEducationDto, ['location'] as const))
	implements IUpdateEducationDto
{
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
