import { UserEntity } from '@tempus/api/shared/entity';
import { AuthDto, JwtPayload, JwtRefreshPayloadWithToken, Tokens } from '@tempus/shared-domain';

export const accessToken = 'accessTokenMock';

export const refreshToken = 'refreshTokenMock';

export const tokens = new Tokens(accessToken, refreshToken)

export const newUser = new UserEntity(null, 'John', 'Doe', 'johndoe@email.com', 'password', null);

export const loggedInUser = new UserEntity(null, 'Jessica', 'Adams', 'jessicaadams@email.com', 'password1', null)
loggedInUser.refreshToken = refreshToken;

export const authDtoEntity = new AuthDto(newUser, accessToken, refreshToken);

export const accessTokenPayload = new JwtPayload(loggedInUser.email, null, null, null);

export const refreshTokenPayloadWithToken = new JwtRefreshPayloadWithToken(
	loggedInUser.email,
	null,
	null,
	refreshToken,
);
