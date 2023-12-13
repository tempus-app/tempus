import { ApiProperty } from '@nestjs/swagger';
import { IReportFiltersDto } from '@tempus/shared-domain';
import { IsNotEmpty } from 'class-validator';

export class ReportFiltersDto implements IReportFiltersDto {

    @ApiProperty()
    clientId: number;

    @ApiProperty()
	projectId: number;

    @ApiProperty()
	resourceId: number;

    @ApiProperty()
	startDate: string;

    @ApiProperty()
	endDate: string;

	constructor(clientId: number, projectId: number, resourceId: number, startDate: string, endDate: string,) {
		this.clientId = clientId;
		this.projectId = projectId;
        this.resourceId = resourceId;
        this.startDate = startDate;
        this.endDate = endDate;
	}
}
