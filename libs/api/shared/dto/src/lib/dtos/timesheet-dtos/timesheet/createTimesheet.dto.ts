import { ApiProperty } from '@nestjs/swagger';
import { ICreateTimesheetDto } from '@tempus/shared-domain';

export class CreateTimesheetDto implements ICreateTimesheetDto {
	@ApiProperty()
	id?: number;

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

	constructor(
		id?: number,
		weekStartDate?: Date,
		weekEndDate?: Date,
		approvedBySupervisor?: boolean,
		approvedByClient?: boolean,
		supervisorComment?: string,
		clientRepresentativeComment?: string,
		audited?: boolean,
		billed?: boolean,
		// resource?: ResourceEntity,
		// timesheetEntry?: TimesheetEntryEntity[],
	) {
		this.id = id;
		this.weekStartDate = weekStartDate;
		this.weekEndDate = weekEndDate;
		this.approvedBySupervisor = approvedBySupervisor;
		this.approvedByClient = approvedByClient;
		this.supervisorComment = supervisorComment;
		this.clientRepresentativeComment = clientRepresentativeComment;
		this.audited = audited;
		this.billed = billed;
		// this.resource = resource;
		// this.timesheetEntry = timesheetEntry;
	}
}
