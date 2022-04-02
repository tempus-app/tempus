import { UserEntity } from '@tempus/api/shared/entity';
import { AuthDto, JwtPayload, JwtRefreshPayloadWithToken } from '@tempus/shared-domain';

export const user = new UserEntity(null, 'John', 'Doe', 'johndoe@email.com', null, null);

export const accessToken = 'accessTokenMock';

export const refreshToken = 'refreshTokenMock';

export const authDto = new AuthDto(user, 'jwtToken', 'jwtToken');

export const accessTokenPayload = new JwtPayload('johndoe@email.com', null, null, null);

export const refreshTokenPayloadWithToken = new JwtRefreshPayloadWithToken(
	'johndoe@email.com',
	null,
	null,
	refreshToken,
);
