import { ApiProperty } from '@nestjs/swagger';
import { ICreateLinkDto, RoleType } from '@tempus/shared-domain';

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
	projectId?: number;

	@ApiProperty()
	userType: RoleType;

	constructor(firstName: string, lastName: string, email: string, expiry: Date, projectId: number, userType: RoleType) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.expiry = expiry;
		this.projectId = projectId;
		this.userType = userType;
	}
}
