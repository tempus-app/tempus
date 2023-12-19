import { ApiProperty } from '@nestjs/swagger';
import { ICreateUserDto, RoleType } from '@tempus/shared-domain';

export class CreateUserDto implements ICreateUserDto {
	@ApiProperty()
	firstName: string;

	@ApiProperty()
	lastName: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	password: string;

	@ApiProperty({ enum: ['BUSINESS_OWNER', 'SUPERVISOR'] })
	roles: RoleType[];

	@ApiProperty()
	active: boolean;

	constructor(
		firstName: string,
		lastName: string,
		email: string,
		password: string,
		roles: RoleType[],
		active: boolean,
	) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.password = password;
		this.roles = roles;
		this.active = active;
	}
}
