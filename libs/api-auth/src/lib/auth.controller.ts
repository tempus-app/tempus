import { Body, Controller, NotImplementedException, Post } from '@nestjs/common'
import { UserEntity } from '@tempus/datalayer'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() req: string): Promise<UserEntity> {
    throw new NotImplementedException()
  }
}
