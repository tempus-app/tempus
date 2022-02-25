import { ConsoleLogger, forwardRef, Inject, Injectable } from '@nestjs/common'
import { UserService } from '@tempus/api-account'
import { AuthDto } from '@tempus/datalayer'
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
    if (user && (await this.comparePassword(password, user.password))) {
      return user
    }
    return null
  }

  async validateUserJWT(email: string) {
    const user = await this.userService.findByEmail(email)
    if (user) {
      return user
    }
    return null
  }

  async login(user): Promise<any> {
    const payload = {
      email: user.email,
      roles: user.roles,
    }
    user.password = null
    const accessToken = this.jwtService.sign(payload)
    const result = new AuthDto(user, accessToken)

    return result
  }

  private async comparePassword(password: string, encryptedPassword: string) {
    return password == encryptedPassword
  }
}
