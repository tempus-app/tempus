import { ApiProperty } from '@nestjs/swagger';
import { IResourceBasicDto } from '@tempus/shared-domain';

export class ResourceBasicDto implements IResourceBasicDto {
	@ApiProperty()
	firstName: string;

	@ApiProperty()
	lastName: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	id: number;

	constructor(id: number, firstName: string, lastName: string, email: string) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
	}
}
