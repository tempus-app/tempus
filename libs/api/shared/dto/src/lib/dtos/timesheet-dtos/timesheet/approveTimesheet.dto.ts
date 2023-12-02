import { ApiProperty } from '@nestjs/swagger';
import { IApproveTimesheetDto } from '@tempus/shared-domain';

export class ApproveTimesheetDto implements IApproveTimesheetDto {
	@ApiProperty()
	comment: string;

	@ApiProperty()
	approval: boolean;

	@ApiProperty()
	approverId: number;

	constructor(comment: string, approval: boolean, approverId: number) {
		this.comment = comment;
		this.approval = approval;
		this.approverId = approverId;
	}
}
