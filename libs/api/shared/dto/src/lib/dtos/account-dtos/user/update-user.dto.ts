import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IUpdateUserDto } from '@tempus/shared-domain';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) implements IUpdateUserDto {
	@ApiProperty()
	id: number;

	constructor(id: number) {
		super();
		this.id = id;
	}
}
