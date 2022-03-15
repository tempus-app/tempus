import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, JwtRefreshPayloadWithToken, User } from '@tempus/shared-domain';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(private authService: AuthService, private configService: ConfigService) {
		super({
			// will we be sending refresh in header or body?
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get('jwtRefreshSecret'),
			passReqToCallback: true,
		});
	}

	async validate(req: Request, payload: JwtPayload): Promise<JwtRefreshPayloadWithToken> {
		const refreshToken = req?.get('authorization')?.replace('Bearer', '').trim();

		if (!refreshToken) throw new ForbiddenException('Refresh token malformed');
		// const user = await this.authService.getUserFromJWT(payload.email);
		// if (!user) {
		// 	throw new UnauthorizedException('Incorrect credentials.');
		// }
		// return user;
		return {
			...payload,
			refreshToken,
		};
	}
}
