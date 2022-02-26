import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCertificationDto } from '.';

export class UpdateCertificationDto extends PartialType(CreateCertificationDto) {
	@ApiProperty()
	id: number;

	constructor(id: number) {
		super();
		this.id = id;
	}
}
