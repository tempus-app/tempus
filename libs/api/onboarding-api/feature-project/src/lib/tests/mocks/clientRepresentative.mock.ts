import { ClientRepresentative } from '@tempus/shared-domain';
import { clientEntityMock } from './client.mock';

export const clientRepresentativeMock: ClientRepresentative = {
	firstName: 'Jessica',
	lastName: 'Day',
	email: 'jessica.day@hotmail.com',
	client: clientEntityMock,
	id: 0,
	projects: [],
};
