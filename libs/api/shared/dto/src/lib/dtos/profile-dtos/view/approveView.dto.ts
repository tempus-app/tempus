import { ApiProperty } from '@nestjs/swagger';
import { IApproveViewDto } from '@tempus/shared-domain';

export class ApproveViewDto implements IApproveViewDto {
	@ApiProperty()
	comment: string;

	@ApiProperty()
	approval: boolean;

	constructor(comment: string, approval: boolean) {
		this.comment = comment;
		this.approval = approval;
	}
}
