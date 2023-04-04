import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IUpdateTimesheetDto } from '@tempus/shared-domain';
import { CreateTimesheetDto } from './createTimesheet.dto';

export class UpdateTimesheetDto extends PartialType(CreateTimesheetDto) implements IUpdateTimesheetDto {
	@ApiProperty()
	id: number;

	constructor(id: number) {
		super();
		this.id = id;
	}
}
