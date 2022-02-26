import { Resource, User } from '../..';

export class AuthDto {
  user: User | Resource;

  jwtAccessToken: string;

  constructor(user: User | Resource, accessToken: string) {
    this.user = user;
    this.jwtAccessToken = accessToken;
  }
}
