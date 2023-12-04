import { ApproveTimesheetDto, CreateTimesheetDto, UpdateTimesheetDto } from "@tempus/api/shared/dto";
import { TimesheetEntity } from "@tempus/api/shared/entity";
import { resourceEntityMock } from "./resource.mock";
import { projectEntityMock } from "./project.mock";
import { TimesheetRevisionType } from "@tempus/shared-domain";
import { supervisorEntityMock } from "./user.mock";

export const createTimesheetMock = new CreateTimesheetDto(
    1,
    2,
    2,
    new Date('2023-10-10'),
    new Date('2023-10-15'),
    false,
    false,
    "",
    "",
    false,
    false,
    0,
    0,
    0,
   0,
    0,
    0,
    0,
);

export const updateTimesheetMock = new UpdateTimesheetDto(3);

export const createTimesheetEntity = new TimesheetEntity(
    3, new Date('2023-10-10'), new Date('2023-10-10'),false,
    false,"","","",false,false,
    0,0,0,0,0,0,0,
    resourceEntityMock,projectEntityMock,supervisorEntityMock,TimesheetRevisionType.NEW,
);

export const timesheetEntityMock: TimesheetEntity = {
    id: 3,
    weekStartDate: new Date('2023-10-10'),
    weekEndDate: new Date('2023-10-10'),
    approvedBySupervisor: false,
    approvedByClient: false,
    resourceComment: "",
    supervisorComment: "",
    clientRepresentativeComment: "",
    audited: false,
    billed: false,
    mondayHours:0,
    tuesdayHours:0,
    wednesdayHours:0,
    thursdayHours:0,
    fridayHours:0,
    saturdayHours:0,
    sundayHours:0,
    resource: resourceEntityMock,
    project: projectEntityMock,
    supervisor: supervisorEntityMock,
    status: TimesheetRevisionType.SUBMITTED,
}

export const dbTimesheet = new TimesheetEntity(
    3, new Date('2023-10-10'), new Date('2023-10-10'),false,
    false,"","","",false,false,
    0,0,0,0,0,0,0,
    resourceEntityMock,projectEntityMock,supervisorEntityMock,TimesheetRevisionType.SUBMITTED,
);


export const submittedTimesheetEntityMock: TimesheetEntity = {
    id: 4,
    weekStartDate: new Date('2023-10-15'),
    weekEndDate: new Date('2023-10-20'),
    approvedBySupervisor: false,
    approvedByClient: false,
    resourceComment: "",
    supervisorComment: "",
    clientRepresentativeComment: "",
    audited: false,
    billed: false,
    mondayHours:5,
    tuesdayHours:5,
    wednesdayHours:5,
    thursdayHours:5,
    fridayHours:5,
    saturdayHours:5,
    sundayHours:5,
    resource: resourceEntityMock,
    project: projectEntityMock,
    supervisor: supervisorEntityMock,
    status: TimesheetRevisionType.SUBMITTED,
}

export const approveTimesheetDto: ApproveTimesheetDto = {
    approval: true,
    comment: "Approving timesheet comment",
    approverId: 0
}
export const RejectTimesheetDto: ApproveTimesheetDto = {
    approval: false,
    comment: "Rejecting timesheet comment",
    approverId: 0
}

export const billedTimesheetEntityMock: TimesheetEntity = {
    id: 5,
    weekStartDate: new Date('2023-10-22'),
    weekEndDate: new Date('2023-10-29'),
    approvedBySupervisor: true,
    approvedByClient: true,
    resourceComment: "",
    supervisorComment: "",
    clientRepresentativeComment: "",
    audited: true,
    billed: true,
    mondayHours:5,
    tuesdayHours:5,
    wednesdayHours:5,
    thursdayHours:5,
    fridayHours:5,
    saturdayHours:5,
    sundayHours:5,
    resource: resourceEntityMock,
    project: projectEntityMock,
    supervisor: supervisorEntityMock,
    status: TimesheetRevisionType.APPROVED,
}
