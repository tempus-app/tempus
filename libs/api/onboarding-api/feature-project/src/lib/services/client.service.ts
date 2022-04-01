/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClientDto, UpdateClientDto } from '@tempus/api/shared/dto';
import { ClientEntity } from '@tempus/api/shared/entity';
import { Client } from '@tempus/shared-domain';
import { Repository } from 'typeorm';

@Injectable()
export class ClientService {
	constructor(
		@InjectRepository(ClientEntity)
		private clientRepository: Repository<ClientEntity>,
	) {}

	async getClient(clientId: number): Promise<Client> {
		const clientEntity = await this.clientRepository.findOne(clientId, {
			relations: ['projects'],
		});
		if (!clientEntity) {
			throw new NotFoundException(`Could not find client with id ${clientEntity.id}`);
		}
		return clientEntity;
	}

	async getAll(): Promise<Client[]> {
		return this.clientRepository.find({ relations: ['projects'] });
	}

	async getClientInfo(clientId: number): Promise<Client> {
		const clientEntity = await this.clientRepository.findOne(clientId);
		if (!clientEntity) throw new NotFoundException(`Could not find client with id ${clientEntity.id}`);
		return clientEntity;
	}

	async getAllClientInfo(): Promise<Client[]> {
		return this.clientRepository.find();
	}

	async createClient(createClientDto: CreateClientDto): Promise<Client> {
		const clientEntity = ClientEntity.fromDto(createClientDto);
		return this.clientRepository.save(clientEntity);
	}

	async updateClient(updateClientDto: UpdateClientDto): Promise<Client> {
		const clientEntity = await this.clientRepository.findOne(updateClientDto.id);
		if (!clientEntity) {
			throw new NotFoundException(`Could not find client with id ${clientEntity.id}`);
		}

		for (const [key, val] of Object.entries(updateClientDto)) if (!val) delete updateClientDto[key];
		Object.assign(clientEntity, updateClientDto);
		return this.clientRepository.save(clientEntity);
	}

	async deleteClient(clientId: number) {
		const clientEntity = await this.clientRepository.findOne(clientId);
		if (!clientEntity) {
			throw new NotFoundException(`Could not find client with id ${clientId}`);
		}
		await this.clientRepository.remove(clientEntity);
	}
}
