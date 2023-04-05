import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IUpdateTimesheetEntryDto } from '@tempus/shared-domain';
import { CreateTimesheetEntryDto } from './createTimesheetEntry.dto';

export class UpdateTimesheetEntryDto extends PartialType(CreateTimesheetEntryDto) implements IUpdateTimesheetEntryDto {
	@ApiProperty()
	id: number;

	constructor(id: number) {
		super();
		this.id = id;
	}
}
