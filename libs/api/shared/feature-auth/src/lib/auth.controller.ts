import { Request, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthDto } from '@tempus/api/shared/dto';
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
}
