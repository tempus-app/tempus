import { createMock } from '@golevelup/ts-jest';
import { BadRequestException, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientRepresentativeEntity } from '@tempus/api/shared/entity';
import { Repository } from 'typeorm';
import { ClientService, ClientRepresentativeService } from '../../services';
import { clientEntityMock } from '../mocks/client.mock';
import { clientRepresentativeMock, clientRepresentativeTwoMock } from '../mocks/clientRepresentative.mock';
import { UserService } from '@tempus/onboarding-api/feature-account';

const mockClientRepresentativeRepository = createMock<Repository<ClientRepresentativeEntity>>();
const mockClientService = createMock<ClientService>();
const mockUserService = createMock<UserService>();

describe('ClientRepresentativeService', () => {
	let moduleRef: TestingModule;
	let clientRepresentativeService: ClientRepresentativeService;
	beforeEach(async () => {
		jest.resetModules();
		moduleRef = await Test.createTestingModule({
			providers: [
				ClientRepresentativeService,
				{
					provide: getRepositoryToken(ClientRepresentativeEntity),
					useValue: mockClientRepresentativeRepository,
				},
				{
					provide: ClientService,
					useValue: mockClientService,
				},
				{
					provide: UserService,
					useValue: mockUserService,
				},
			],
		}).compile();

		clientRepresentativeService = moduleRef.get<ClientRepresentativeService>(ClientRepresentativeService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});
	describe('Get Client Representative', () => {
		describe('Get by ID', () => {
			it('should get by id', async () => {
				mockClientRepresentativeRepository.findOne.mockResolvedValue(clientRepresentativeMock);

				const res = await clientRepresentativeService.getClientRepresentativeInfo(clientRepresentativeMock.id);
				expect(mockClientRepresentativeRepository.findOne).toBeCalledWith(clientRepresentativeMock.id, {
					relations: ['client', 'projects'],
				});
				expect(res).toEqual({ ...clientRepresentativeMock });
			});
			it('should throw an error if representative does not exist', async () => {
				mockClientRepresentativeRepository.findOne.mockResolvedValue(undefined);
				let error;
				try {
					await clientRepresentativeService.getClientRepresentativeInfo(clientRepresentativeMock.id);
				} catch (e) {
					error = e;
				}
				expect(error).toBeInstanceOf(NotFoundException);
				expect(error.message).toEqual(`Could not find client representative with id ${clientRepresentativeMock.id}`);
			});
		});

		describe('Get by Client Id', () => {
			it('should get all representatives by client id', async () => {
				mockClientRepresentativeRepository.find.mockResolvedValue([
					clientRepresentativeMock,
					clientRepresentativeTwoMock,
				]);
				mockClientService.getClientInfo.mockResolvedValue(clientEntityMock);

				const res = await clientRepresentativeService.getRepresentatives(clientEntityMock.id);
				expect(mockClientService.getClientInfo).toBeCalledWith(clientEntityMock.id);
				expect(mockClientRepresentativeRepository.find).toBeCalledWith({
					where: { client: clientEntityMock },
				});
				expect(res).toEqual([clientRepresentativeMock, clientRepresentativeTwoMock]);
			});

			it('should throw an error if client does not exist', async () => {
				mockClientService.getClientInfo.mockRejectedValue(new NotFoundException('foo'));
				let error;
				try {
					await clientRepresentativeService.getRepresentatives(clientEntityMock.id);
				} catch (e) {
					error = e;
				}
				expect(error).toBeInstanceOf(NotFoundException);
				expect(error.message).toEqual(`foo`);
			});
		});
	});

	describe('Create Client Representative', () => {
		it('should create client representative with given data', async () => {
			mockClientRepresentativeRepository.save.mockResolvedValue(clientRepresentativeMock);
			mockClientRepresentativeRepository.findOne.mockResolvedValue(undefined);

			mockClientService.getClientInfo.mockResolvedValue(clientEntityMock);

			await clientRepresentativeService.createClientRepresentative(
				clientRepresentativeMock.firstName,
				clientRepresentativeMock.lastName,
				clientRepresentativeMock.email,
				clientEntityMock.id,
			);

			expect(mockClientService.getClientInfo).toBeCalledWith(clientEntityMock.id);

			expect(mockClientRepresentativeRepository.save).toBeCalledWith({
				firstName: clientRepresentativeMock.firstName,
				lastName: clientRepresentativeMock.lastName,
				email: clientRepresentativeMock.email,
				client: clientEntityMock,
			});
		});

		it('should create not create client representative if already exists', async () => {
			mockClientRepresentativeRepository.save.mockResolvedValue(clientRepresentativeMock);
			mockClientService.getClientInfo.mockResolvedValue(clientEntityMock);

			await clientRepresentativeService.createClientRepresentative(
				clientRepresentativeMock.firstName,
				clientRepresentativeMock.lastName,
				clientRepresentativeMock.email,
				clientEntityMock.id,
			);

			expect(mockClientService.getClientInfo).toBeCalledWith(clientEntityMock.id);

			expect(mockClientRepresentativeRepository.save).toBeCalledWith({
				firstName: clientRepresentativeMock.firstName,
				lastName: clientRepresentativeMock.lastName,
				email: clientRepresentativeMock.email,
				client: clientEntityMock,
			});
		});

		it('should throw an error if client does not exist', async () => {
			mockClientRepresentativeRepository.findOne.mockResolvedValue(clientRepresentativeMock);
			let error;
			try {
				await clientRepresentativeService.createClientRepresentative(
					clientRepresentativeMock.firstName,
					clientRepresentativeMock.lastName,
					clientRepresentativeMock.email,
					clientEntityMock.id,
				);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(BadRequestException);
			expect(error.message).toEqual(
				`Client Representative with email ${clientRepresentativeMock.email} already exists`,
			);
			expect(mockClientRepresentativeRepository.save).not.toBeCalled();
		});
	});
});
