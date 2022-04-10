import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, JwtRefreshPayloadWithToken } from '@tempus/shared-domain';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(private configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get('jwtRefreshSecret'),
			passReqToCallback: true,
		});
	}

	async validate(req: Request, payload: JwtPayload): Promise<JwtRefreshPayloadWithToken> {
		const refreshToken = req?.get('authorization')?.replace('Bearer', '').trim();

		if (!refreshToken) throw new ForbiddenException('Refresh token malformed');
		return {
			...payload,
			refreshToken,
		};
	}
}
