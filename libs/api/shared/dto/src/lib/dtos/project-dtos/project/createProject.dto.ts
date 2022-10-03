import { ApiProperty } from '@nestjs/swagger';
import { ICreateProjectDto, ProjectStatus } from '@tempus/shared-domain';
import { IsDateString, IsNotEmpty, ValidateIf } from 'class-validator';

export class CreateProjectDto implements ICreateProjectDto {
	@ApiProperty({ required: true })
	@IsNotEmpty()
	name: string;

	@ApiProperty({ required: true })
	@IsDateString()
	startDate: Date;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	clientId: number;

	@ApiProperty()
	clientRepresentativeId?: number;

	@ApiProperty()
	@ValidateIf((obj, value) => !obj.clientRepresentativeId || value)
	clientRepresentativeFirstName?: string;

	@ApiProperty()
	@ValidateIf((obj, value) => !obj.clientRepresentativeId || value)
	clientRepresentativeLastName?: string;

	@ApiProperty()
	@ValidateIf((obj, value) => !obj.clientRepresentativeId || value)
	clientRepresentativeEmail?: string;

	@ApiProperty()
	status?: ProjectStatus;

	constructor(
		clientId: number,
		name: string,
		startDate: Date,
		clientRepresentativeId?: number,
		clientRepresentativeFirstName?: string,
		clientRepresentativeLastName?: string,
		clientRepresentativeEmail?: string,
		status?: ProjectStatus,
	) {
		this.name = name;
		this.startDate = startDate;
		this.clientId = clientId;
		this.clientRepresentativeId = clientRepresentativeId;
		this.clientRepresentativeFirstName = clientRepresentativeFirstName;
		this.clientRepresentativeEmail = clientRepresentativeEmail;
		this.clientRepresentativeLastName = clientRepresentativeLastName;
		this.status = status;
	}
}
