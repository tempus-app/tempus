import { CreateClientDto, UpdateClientDto } from '@tempus/api/shared/dto';
import { ClientEntity } from '@tempus/api/shared/entity';

export const clientEntityMock: ClientEntity = {
	id: 3,
	clientName: 'Irvin Construction',
	projects: [],
	representatives: [],
};

export const createDtoMock = new CreateClientDto('Henz');

export const updateDtoMock = new UpdateClientDto(3);
updateDtoMock.clientName = 'Price';
