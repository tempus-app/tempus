import { ApiProperty } from '@nestjs/swagger';
import { ICreateTimesheetDto } from '@tempus/shared-domain';
import { CreateTimesheetEntryDto } from '../timesheet-entry/createTimesheetEntry.dto';

export class CreateTimesheetDto implements ICreateTimesheetDto {

	@ApiProperty()
	supervisorId?: number;

	@ApiProperty()
	resourceId?: number;

	@ApiProperty()
	projectId?: number;

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
	mondayHours?:number;

	@ApiProperty()
	tuesdayHours?:number;
	
	@ApiProperty()
	wednesdayHours?:number;

	@ApiProperty()
	thursdayHours?:number;

	@ApiProperty()
	fridayHours?:number;

	@ApiProperty()
	saturdayHours?:number;

	@ApiProperty()
	sundayHours?:number;

	constructor(
		supervisorId? : number,
		resourceId?: number,
		projectId?: number,
		weekStartDate?: Date,
		weekEndDate?: Date,
		approvedBySupervisor?: boolean,
		approvedByClient?: boolean,
		supervisorComment?: string,
		clientRepresentativeComment?: string,
		audited?: boolean,
		billed?: boolean,
		mondayHours?:number,
		tuesdayHours?:number,
		wednesdayHours?:number,
		thursdayHours?:number,
		fridayHours?:number,
		saturdayHours?:number,
		sundayHours?:number,
	) {
		this.supervisorId = supervisorId;
		this.resourceId = resourceId;
		this.projectId = projectId;
		this.weekStartDate = weekStartDate;
		this.weekEndDate = weekEndDate;
		this.approvedBySupervisor = approvedBySupervisor;
		this.approvedByClient = approvedByClient;
		this.supervisorComment = supervisorComment;
		this.clientRepresentativeComment = clientRepresentativeComment;
		this.audited = audited;
		this.billed = billed;
		this.mondayHours = mondayHours
		this.tuesdayHours = tuesdayHours
		this.wednesdayHours = wednesdayHours
		this.thursdayHours = thursdayHours
		this.fridayHours = fridayHours
		this.saturdayHours = saturdayHours
		this.sundayHours = sundayHours
	}
}
