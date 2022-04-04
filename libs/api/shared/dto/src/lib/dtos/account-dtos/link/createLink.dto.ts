import { ApiProperty } from '@nestjs/swagger';
import { ICreateLinkDto } from '@tempus/shared-domain';

export class CreateLinkDto implements ICreateLinkDto {
	@ApiProperty()
	firstName: string;

	@ApiProperty()
	lastName: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	expiry?: Date;

	@ApiProperty()
	projectId: number;

	constructor(firstName: string, lastName: string, email: string, expiry: Date, projectId: number) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.expiry = expiry;
		this.projectId = projectId;
	}
}
