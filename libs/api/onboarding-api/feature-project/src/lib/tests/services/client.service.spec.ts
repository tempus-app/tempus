// eslint-disable-next-line import/no-extraneous-dependencies
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientEntity } from '@tempus/api/shared/entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { clientEntityMock, createDtoMock, updateDtoMock } from '../mocks/client.mock';
import { ClientService } from '../../services';
import { projectEntityMock } from '../mocks/project.mock';

const mockClientRepository = createMock<Repository<ClientEntity>>();

describe('ClientService', () => {
	let moduleRef: TestingModule;
	let clientService: ClientService;
	beforeEach(async () => {
		jest.resetModules();
		moduleRef = await Test.createTestingModule({
			providers: [
				ClientService,
				{
					provide: getRepositoryToken(ClientEntity),
					useValue: mockClientRepository,
				},
			],
		}).compile();

		clientService = moduleRef.get<ClientService>(ClientService);

		// more imports
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('Get Client', () => {
		it('should Get client with Project Info', async () => {
			mockClientRepository.findOne.mockResolvedValue({ ...clientEntityMock, projects: [projectEntityMock] });
			const res = await clientService.getClient(clientEntityMock.id);

			expect(mockClientRepository.findOne).toBeCalledWith(clientEntityMock.id, { relations: ['projects'] });
			expect(res).toEqual({ ...clientEntityMock, projects: [projectEntityMock] });
		});
		it('should throw error if client does not exist', async () => {
			mockClientRepository.findOne.mockResolvedValue(undefined);
			let error;
			try {
				await clientService.getClient(clientEntityMock.id);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(NotFoundException);
			expect(error.message).toEqual(`Could not find client with id ${clientEntityMock.id}`);
		});
	});

	describe('Create Client', () => {
		it('should create Client', async () => {
			mockClientRepository.findOne.mockResolvedValue({ ...clientEntityMock });
			mockClientRepository.save.mockResolvedValue({
				...clientEntityMock,
				clientName: createDtoMock.clientName,
			});

			const res = await clientService.createClient(createDtoMock);

			expect(mockClientRepository.save).toBeCalledWith({
				...clientEntityMock,
				clientName: createDtoMock.clientName,
				id: undefined,
				projects: null,
				representatives: null,
			});

			expect(res).toEqual({
				...clientEntityMock,
				clientName: createDtoMock.clientName,
			});
		});
	});

	describe('Update Client', () => {
		it('should update client with new details', async () => {
			mockClientRepository.findOne.mockResolvedValue({ ...clientEntityMock });
			await clientService.updateClient(updateDtoMock);

			expect(mockClientRepository.save).toBeCalledWith({
				...clientEntityMock,
				clientName: updateDtoMock.clientName,
			});
		});
		it('should throw error if client does not exist', async () => {
			mockClientRepository.findOne.mockResolvedValue(undefined);
			let error;
			try {
				await clientService.updateClient(updateDtoMock);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(NotFoundException);
			expect(error.message).toEqual(`Could not find client with id ${clientEntityMock.id}`);
		});
	});

	describe('Delete Client', () => {
		it('should delete', async () => {
			mockClientRepository.findOne.mockResolvedValue({ ...clientEntityMock });
			await clientService.deleteClient(clientEntityMock.id);

			expect(mockClientRepository.remove).toBeCalledWith({
				...clientEntityMock,
			});
		});
		it('should throw error if client does not exist', async () => {
			mockClientRepository.findOne.mockResolvedValue(undefined);
			let error;
			try {
				await clientService.deleteClient(clientEntityMock.id);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(NotFoundException);
			expect(error.message).toEqual(`Could not find client with id ${clientEntityMock.id}`);
		});
	});
});
