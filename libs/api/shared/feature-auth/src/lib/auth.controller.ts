import { Request, Controller, Post, UseGuards, NotImplementedException } from '@nestjs/common';
import { Tokens } from '@tempus/shared-domain';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	login(@Request() req): Promise<Tokens> {
		return this.authService.login(req.user);
	}

	@UseGuards(JwtRefreshGuard)
	@Post('refresh')
	refresh(@Request() req): Promise<any> {
		throw new NotImplementedException();
	}
}
