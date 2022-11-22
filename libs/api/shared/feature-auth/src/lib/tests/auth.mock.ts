import { PasswordResetEntity, UserEntity } from '@tempus/api/shared/entity';
import {
	AuthDto,
	JwtPayload,
	JwtRefreshPayloadWithToken,
	PasswordResetStatus,
	ResetPasswordDto,
	TokensDto,
} from '@tempus/shared-domain';

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

export const user = new UserEntity(null, 'Jessica', 'Adams', 'jessicaadams@email.com', 'password1', null);
export const userWithId = new UserEntity(4, 'Jessica', 'Adams', 'jessicaadams@email.com', 'password1', null);

const currentDate = new Date();
export const passwordResetMock = new PasswordResetEntity(
	null,
	userWithId,
	new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1),
	'fake-uuid',
	PasswordResetStatus.VALID,
);
export const resetPasswordDto = new ResetPasswordDto('jessicaadams@email.com', 'fake-uuid', 'password16');
