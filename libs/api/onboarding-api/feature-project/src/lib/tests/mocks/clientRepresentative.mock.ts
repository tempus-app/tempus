import { ClientRepresentative } from '@tempus/shared-domain';
import { clientEntityMock } from './client.mock';

export const clientRepresentativeMock: ClientRepresentative = {
	firstName: 'Jessica',
	lastName: 'Day',
	email: 'jessica.day@hotmail.com',
	client: clientEntityMock,
	id: 3,
	projects: [],
};

export const clientRepresentativeTwoMock: ClientRepresentative = {
	firstName: 'Nick',
	lastName: 'Miller',
	email: 'nick.miller@hotmail.com',
	client: clientEntityMock,
	id: 10,
	projects: [],
};
