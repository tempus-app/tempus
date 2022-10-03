import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity, ClientRepresentativeEntity } from '@tempus/api/shared/entity';
import { Repository } from 'typeorm';
import { ClientService } from './client.service';

@Injectable()
export class ClientRepresentativeService {
	constructor(
		@InjectRepository(ClientRepresentativeEntity)
		private clientRepresentativeRepository: Repository<ClientRepresentativeEntity>,
		private clientService: ClientService,
	) {}

	async getClientRepresentativeInfo(clientRepresentativeId: number): Promise<ClientRepresentativeEntity> {
		const clientRepresentative = await this.clientRepresentativeRepository.findOne(clientRepresentativeId);
		if (!clientRepresentative) {
			throw new NotFoundException(`Could not find client representative with id ${clientRepresentativeId}`);
		}
		return clientRepresentative;
	}

	async createClientRepresentative(
		firstName: string,
		lastName: string,
		email: string,
		client: ClientEntity,
	): Promise<ClientRepresentativeEntity> {
		return this.clientRepresentativeRepository.save({ firstName, lastName, email, client });
	}

	async getRepresentatives(clientId: number): Promise<ClientRepresentativeEntity[]> {
		const clientEntity = await this.clientService.getClientInfo(clientId);
		if (!clientEntity) throw new NotFoundException(`Could not find client with id ${clientId}`);
		const clientRepresentatives = await this.clientRepresentativeRepository.find({
			where: { client: clientEntity },
		});

		return clientRepresentatives;
	}
}
