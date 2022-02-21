import { Body, Controller, NotImplementedException, Post, UseGuards } from '@nestjs/common'
import { UserEntity } from '@tempus/datalayer'
import { LocalAuthGuard } from './local-auth.guard'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body() req: string): Promise<UserEntity> {
    throw new NotImplementedException()
  }
}
