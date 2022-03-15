import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IUpdateCertificationDto } from '@tempus/shared-domain';
import { CreateCertificationDto } from '.';

export class UpdateCertificationDto extends PartialType(CreateCertificationDto) implements IUpdateCertificationDto {
	@ApiProperty()
	id: number;

	constructor(id: number) {
		super();
		this.id = id;
	}
}
