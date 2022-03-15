import { ApiProperty } from '@nestjs/swagger';
import { IUpdateLinkDto, StatusType } from '@tempus/shared-domain';

export class UpdatelinkDto implements IUpdateLinkDto {
	@ApiProperty()
	id: number;

	@ApiProperty()
	status: StatusType;

	constructor(id: number, status: StatusType) {
		this.id = id;
		this.status = status;
	}
}
