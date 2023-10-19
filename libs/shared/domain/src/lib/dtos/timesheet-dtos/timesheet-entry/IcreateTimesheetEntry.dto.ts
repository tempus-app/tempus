import { ICreateTimesheetDto } from "../timesheet/IcreateTimesheet.dto";

export interface ICreateTimesheetEntryDto {

	date?: Date;
    hoursWorked?: number;
    startTime?: number;
    endTime?: number;
   // timesheet?: ICreateTimesheetDto;
}
