import { UserEntity } from '@tempus/api/shared/entity';
import { AuthDto, JwtPayload, JwtRefreshPayloadWithToken, TokensDto } from '@tempus/shared-domain';

export const accessToken = 'accessTokenMock';

export const refreshToken = 'refreshTokenMock';

export const tokens = new TokensDto(accessToken, refreshToken);

export const newUserEntity = new UserEntity(null, 'John', 'Doe', 'johndoe@email.com', 'password', null);

export const loggedInUserEntity = new UserEntity(null, 'Jessica', 'Adams', 'jessicaadams@email.com', 'password1', null);
loggedInUserEntity.refreshToken = refreshToken;

export const authDtoEntity = new AuthDto(newUserEntity, accessToken, refreshToken);

export const accessTokenPayload = new JwtPayload(loggedInUserEntity.email, null, null, null);

export const refreshTokenPayloadWithToken = new JwtRefreshPayloadWithToken(
	loggedInUserEntity.email,
	null,
	null,
	refreshToken,
);

// used for non-logged in user
export const invalidRefreshTokenPayloadWithToken = new JwtRefreshPayloadWithToken(
	newUserEntity.email,
	null,
	null,
	null,
);
