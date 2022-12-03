import { Request, Controller, Post, UseGuards, HttpCode, HttpStatus, Query, Body } from '@nestjs/common';
import { TokensDto, AuthDto, ResetPasswordDto } from '@tempus/shared-domain';
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

	@HttpCode(HttpStatus.OK)
	@Post('forgot-password')
	forgotPassword(@Query('email') email: string) {
		return this.authService.forgotPassword(email);
	}

	@HttpCode(HttpStatus.OK)
	@Post('reset-password')
	resetPassword(@Body() resetPasswordData: ResetPasswordDto) {
		return this.authService.resetPassword(resetPasswordData);
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
	refresh(@Request() req): Promise<TokensDto> {
		return this.authService.refreshToken(req.user);
	}
}
