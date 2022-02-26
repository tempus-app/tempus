import { Body, Request, Controller, NotImplementedException, Post, UseGuards } from '@nestjs/common';
import { AuthDto, UserEntity } from '@tempus/datalayer';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req): Promise<AuthDto> {
    return this.authService.login(req.user);
  }

  @Post('signup')
  signup(@Body() req: string): Promise<UserEntity> {
    throw new NotImplementedException();
  }
}
