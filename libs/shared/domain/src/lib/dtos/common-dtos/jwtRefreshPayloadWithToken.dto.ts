export class JwtRefreshPayloadWithToken {
	email: string;

	iat: number;

	exp: number;

	refreshToken: string;

	constructor(email: string, iat: number, exp: number, refreskToken: string) {
		this.email = email;
		this.iat = iat;
		this.exp = exp;
		this.refreshToken = refreskToken;
	}
}
