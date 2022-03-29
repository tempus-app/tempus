import { ApiProperty } from '@nestjs/swagger';
import { ICreateProjectDto } from '@tempus/shared-domain';

export class CreateProjectDto implements ICreateProjectDto {
	@ApiProperty()
	name: string;

	@ApiProperty()
	startDate: Date;

	@ApiProperty()
	endDate: Date;

	@ApiProperty()
	clientId: number;

	constructor(clientId: number, name: string, startDate: Date, endDate: Date) {
		this.endDate = endDate;
		this.name = name;
		this.startDate = startDate;
		this.clientId = clientId;
	}
}
