import { Body, Request, Controller, NotImplementedException, Post, UseGuards, Get } from '@nestjs/common'
import { LoginDto, RoleType, UserEntity } from '@tempus/datalayer'
import { LocalAuthGuard } from './local-auth.guard'
import { AuthService } from './auth.service'
import { Roles } from './roles.decorator'
import { JwtAuthGuard } from './jwt-auth.guard'
import { RolesGuard } from './roles.guard'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req): Promise<LoginDto> {
    return this.authService.login(req.user)
  }

  @Post('signup')
  signup(@Body() req: string): Promise<UserEntity> {
    throw new NotImplementedException()
  }
}
