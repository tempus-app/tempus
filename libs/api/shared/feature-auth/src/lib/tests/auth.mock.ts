import { UserEntity } from '@tempus/api/shared/entity';
import { AuthDto } from '@tempus/shared-domain';

export const user = new UserEntity(null, 'John', 'Doe', 'johndoe@email.com', null, null);

export const accessToken = 'accessTokenMock';

export const refreshToken = 'refreshTokenMock';

export const authDto = new AuthDto(user, 'jwtToken', 'jwtToken');
