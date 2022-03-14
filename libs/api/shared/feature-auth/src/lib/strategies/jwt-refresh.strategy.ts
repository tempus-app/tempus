import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, User } from '@tempus/shared-domain';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(private authService: AuthService, private configService: ConfigService) {
		super({
			// will we be sending refresh in header or body?
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get('jwtRefreshSecret'),
		});
	}

	async validate(payload: JwtPayload): Promise<User> {
		const user = await this.authService.getUserFromJWT(payload.email);
		if (!user) {
			throw new UnauthorizedException('Incorrect credentials.');
		}
		return user;
	}
}
