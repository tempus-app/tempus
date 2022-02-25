import { Resource, ResourceEntity, User } from '@tempus/datalayer'

export class LoginDto {
  user: User | Resource
  jwtAccessToken: string

  constructor(user: User | Resource, accessToken: string) {
    this.user = user
    this.jwtAccessToken = accessToken
  }
}
