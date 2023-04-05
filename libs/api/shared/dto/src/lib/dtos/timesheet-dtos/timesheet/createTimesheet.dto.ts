import { ApiProperty } from '@nestjs/swagger';
import { ICreateTimesheetDto } from '@tempus/shared-domain';
import { CreateTimesheetEntryDto } from '../timesheet-entry/createTimesheetEntry.dto';

export class CreateTimesheetDto implements ICreateTimesheetDto {

	@ApiProperty()
	weekStartDate?: Date;

	@ApiProperty()
	weekEndDate?: Date;

	@ApiProperty()
	approvedBySupervisor?: boolean;

	@ApiProperty()
	approvedByClient?: boolean;

	@ApiProperty()
	supervisorComment?: string;

	@ApiProperty()
	clientRepresentativeComment?: string;

	@ApiProperty()
	audited?: boolean;

	@ApiProperty()
	billed?: boolean;

	@ApiProperty()
	timesheetEntries?: CreateTimesheetEntryDto[];

	constructor(
		weekStartDate?: Date,
		weekEndDate?: Date,
		approvedBySupervisor?: boolean,
		approvedByClient?: boolean,
		supervisorComment?: string,
		clientRepresentativeComment?: string,
		audited?: boolean,
		billed?: boolean,
		timesheetEntries?: CreateTimesheetEntryDto[],
	) {
		this.weekStartDate = weekStartDate;
		this.weekEndDate = weekEndDate;
		this.approvedBySupervisor = approvedBySupervisor;
		this.approvedByClient = approvedByClient;
		this.supervisorComment = supervisorComment;
		this.clientRepresentativeComment = clientRepresentativeComment;
		this.audited = audited;
		this.billed = billed;
		this.timesheetEntries = timesheetEntries;
	}
}