import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateResourceDto } from './create-resource.dto';

export class UpdateResourceDto extends PartialType(CreateResourceDto) {
	@ApiProperty()
	id: number;

	constructor(id: number) {
		super();
		this.id = id;
	}
}
