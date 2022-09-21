import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IUpdateClientDto } from '@tempus/shared-domain';
import { CreateClientDto } from './createClient.dto';

export class UpdateClientDto extends PartialType(CreateClientDto) implements IUpdateClientDto {
	@ApiProperty()
	id: number;

	constructor(id: number) {
		super();
		this.id = id;
	}
}
