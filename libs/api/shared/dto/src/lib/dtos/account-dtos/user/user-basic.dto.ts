import { ApiProperty } from '@nestjs/swagger';
import { IUserBasicDto, RoleType } from '@tempus/shared-domain';

export class UserBasicDto implements IUserBasicDto {
	@ApiProperty()
	firstName: string;

	@ApiProperty()
	lastName: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	id: number;

	@ApiProperty({ enum: RoleType })
	roles: RoleType[];

	constructor(id: number, firstName: string, lastName: string, email: string, roles: RoleType[]) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.roles = roles;
	}
}
