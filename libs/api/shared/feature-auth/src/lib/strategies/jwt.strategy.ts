import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@tempus/shared-domain';
import { JwtPayload } from '@tempus/api/shared/dto';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService, private configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get('jwtSecret'),
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
