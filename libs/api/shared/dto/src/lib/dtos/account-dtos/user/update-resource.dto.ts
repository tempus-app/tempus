import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IUpdateResourceDto } from '@tempus/shared-domain';
import { CreateResourceDto } from './create-resource.dto';

export class UpdateResourceDto extends PartialType(CreateResourceDto) implements IUpdateResourceDto {
	@ApiProperty()
	id: number;

	constructor(id: number) {
		super();
		this.id = id;
	}
}
