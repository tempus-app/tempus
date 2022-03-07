import { ApiProperty } from '@nestjs/swagger';

export class CreateLinkDto {
	@ApiProperty()
	firstName: string;

	@ApiProperty()
	lastName: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	expiry: Date;

	constructor(firstName: string, lastName: string, email: string, expiry: Date) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.expiry = expiry;
	}
}
