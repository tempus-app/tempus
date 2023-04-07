import { ApiProperty } from '@nestjs/swagger';
import { IApproveTimesheetDto } from '@tempus/shared-domain';

export class ApproveTimesheetDto implements IApproveTimesheetDto {
	@ApiProperty()
	comment: string;

	@ApiProperty()
	approval: boolean;

	constructor(comment: string, approval: boolean) {
		this.comment = comment;
		this.approval = approval;
	}
}
