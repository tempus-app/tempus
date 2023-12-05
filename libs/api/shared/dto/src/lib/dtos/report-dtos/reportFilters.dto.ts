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
	month: number;

    @ApiProperty()
	year: number;

	constructor(clientId: number, projectId: number, resourceId: number, month: number, year: number,) {
		this.clientId = clientId;
		this.projectId = projectId;
        this.resourceId = clientId;
        this.month = month;
        this.year = year;
	}
}
