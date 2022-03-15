import { Resource, User } from '../../models/account-models';

export class AuthDto {
	user: User | Resource;

	accessToken: string;

	refreshToken: string;

	constructor(user: User | Resource, accessToken: string, refreshToken: string) {
		this.user = user;
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
	}
}
