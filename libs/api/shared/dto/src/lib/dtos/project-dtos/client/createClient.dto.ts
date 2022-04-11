import { ApiProperty } from '@nestjs/swagger';
import { ICreateClientDto } from '@tempus/shared-domain';

export class CreateClientDto implements ICreateClientDto {
	@ApiProperty()
	clientName: string;

	constructor(clientName: string) {
		this.clientName = clientName;
	}
}
