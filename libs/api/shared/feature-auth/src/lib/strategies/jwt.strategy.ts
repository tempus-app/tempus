import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '@tempus/shared-domain';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-access') {
	constructor(private configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get('jwtAccessSecret'),
		});
	}

	async validate(payload: JwtPayload): Promise<JwtPayload> {
		return payload;
	}
}
