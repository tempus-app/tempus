import { ConsoleLogger, forwardRef, Inject, Injectable } from '@nestjs/common'
import { UserService } from '@tempus/api-account'
import { LoginDto, UserEntity } from '@tempus/datalayer'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email)
    console.log(user)
    if (user && (await this.comparePassword(password, user.password))) {
      return user // return userDTO (wait for Mustafa to merge)
    }

    return null
  }

  async login(user): Promise<any> {
    const payload = {
      sub: user.email,
      roles: user.roles,
    }
    user.password = null
    const accessToken = this.jwtService.sign(payload)
    const result = new LoginDto(user, accessToken)

    return result
  }

  private async comparePassword(password: string, encryptedPassword: string) {
    return password == encryptedPassword
  }
}
