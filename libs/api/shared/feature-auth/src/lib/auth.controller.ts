import { Request, Controller, Post, UseGuards, NotImplementedException, HttpCode, HttpStatus } from '@nestjs/common';
import { Tokens, AuthDto } from '@tempus/shared-domain';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@UseGuards(LocalAuthGuard)
	@HttpCode(HttpStatus.OK)
	@Post('login')
	login(@Request() req): Promise<AuthDto> {
		return this.authService.login(req.user);
	}

	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.OK)
	@Post('logout')
	logout(@Request() req) {
		return this.authService.logout(req.user);
	}

	@UseGuards(JwtRefreshGuard)
	@HttpCode(HttpStatus.OK)
	@Post('refresh')
	refresh(@Request() req): Promise<Tokens> {
		return this.authService.refreshToken(req.user);
	}
}
