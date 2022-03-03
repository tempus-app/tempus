import { forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserService } from '@tempus/api-account';
import { AuthDto, User } from '@tempus/datalayer';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
	constructor(
		@Inject(forwardRef(() => UserService))
		private userService: UserService,
		private jwtService: JwtService,
	) {}

	async validateUser(email: string, password: string): Promise<User> {
		const user = await this.userService.findByEmail(email);
		if (user && (await AuthService.comparePassword(password, user.password))) {
			return user;
		}
		return null;
	}

	async getUserFromJWT(email: string) {
		const user = await this.userService.findByEmail(email);
		if (user) {
			return user;
		}
		return null;
	}

	async login(user: User): Promise<AuthDto> {
		const partialUser = user;
		const payload = {
			email: partialUser.email,
			roles: partialUser.roles,
		};
		partialUser.password = null;
		const accessToken = this.jwtService.sign(payload);
		const result = new AuthDto(partialUser, accessToken);

		return result;
	}

	private static comparePassword(password: string, encryptedPassword: string): boolean {
		try {
			return compare(password, encryptedPassword);
		} catch (e) {
			throw new InternalServerErrorException(e);
		}
	}
}
