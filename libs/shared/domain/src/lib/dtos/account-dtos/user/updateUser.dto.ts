import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from '../../..';

export class UpdateUserDto extends PartialType(CreateUserDto) {
	@ApiProperty()
	id: number;

	constructor(id: number) {
		super();
		this.id = id;
	}
}
