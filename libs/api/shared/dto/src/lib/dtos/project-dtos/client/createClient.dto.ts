import { ApiProperty } from '@nestjs/swagger';
import { ICreateClientDto } from '@tempus/shared-domain';

export class CreateClientDto implements ICreateClientDto {
	@ApiProperty()
	name: string;

	@ApiProperty()
	title: string;

	@ApiProperty()
	clientName: string;

	constructor(name: string, title: string, clientName: string) {
		this.name = name;
		this.title = title;
		this.clientName = clientName;
	}
}
