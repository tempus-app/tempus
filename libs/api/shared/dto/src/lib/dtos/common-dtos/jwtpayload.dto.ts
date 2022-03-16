import { RoleType } from '@tempus/shared-domain';

export class JwtPayload {
	email: string;

	roles: RoleType[];

	iat: number;

	exp: number;

	constructor(email: string, roles: RoleType[], iat: number, exp: number) {
		this.email = email;
		this.roles = roles;
		this.iat = iat;
		this.exp = exp;
	}
}
