import { ApiProperty } from '@nestjs/swagger';
import { ICreateTimesheetEntryDto } from '@tempus/shared-domain';
import { CreateTimesheetDto } from '../timesheet/createTimesheet.dto';

export class CreateTimesheetEntryDto implements ICreateTimesheetEntryDto {

	@ApiProperty()
	date?: Date;

	@ApiProperty()
    hoursWorked?: number;

	@ApiProperty()
	startTime?: number;

	@ApiProperty()
	endTime?: number;

	@ApiProperty()
    timesheet?: CreateTimesheetDto;

	constructor(
		date?: Date,
		hoursWorked?: number,
		startTime?: number,
		endTime?: number,
		timesheet?: CreateTimesheetDto,
	) {
		this.date = date;
        this.hoursWorked = hoursWorked;
        this.startTime = startTime;
        this.endTime = endTime;
        this.timesheet = timesheet;
	}
}