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

    if (user && (await this.comparePassword(password, user.password))) {
      return user // return userDTO (wait for Mustafa to merge)
    }

    return null
  }

  async login(user: LoginDto): Promise<any> {
    const userEntity = await this.userService.findByEmail(user.email)

    const payload = {
      email: userEntity.email,
      sub: userEntity.id,
    }

    return {
      accessToken: this.jwtService.sign(payload),
    }
  }

  private async comparePassword(password: string, encryptedPassword: string) {
    return password == encryptedPassword
  }
}
