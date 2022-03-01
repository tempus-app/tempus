import { ApiProperty } from '@nestjs/swagger';
import { StatusType } from '../../..';
import { UpdateUserDto } from '../user/updateUser.dto';

export class UpdatelinkDto {
	@ApiProperty()
	id: number;

	@ApiProperty()
	status: StatusType;

	constructor(id: number, status: StatusType) {
		this.id = id;
		this.status = status;
	}
}
