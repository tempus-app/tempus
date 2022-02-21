import { Injectable } from '@nestjs/common'
import { UserService } from '@tempus/api-account'
import { UserEntity } from '@tempus/datalayer'

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email)

    if (user && this.comparePassword(password, user.password)) {
      return user // return userDTO (wait for Mustafa to merge)
    }
  }

  private async comparePassword(password: string, encryptedPassword: string) {
    return password === encryptedPassword
  }
}
