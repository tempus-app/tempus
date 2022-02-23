import { Body, Request, Controller, NotImplementedException, Post, UseGuards, Get } from '@nestjs/common'
import { LoginDto, UserEntity } from '@tempus/datalayer'
import { LocalAuthGuard } from './local-auth.guard'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body() user: LoginDto): Promise<UserEntity> {
    return this.authService.login(user)
  }

  @Post('signup')
  signup(@Body() req: string): Promise<UserEntity> {
    throw new NotImplementedException()
  }

  @Get('test')
  test(@Body() req: string): string {
    return 'hello'
  }
}
