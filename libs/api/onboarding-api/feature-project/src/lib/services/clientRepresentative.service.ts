import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientRepresentativeEntity } from '@tempus/api/shared/entity';
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
		const clientRepresentative = await this.clientRepresentativeRepository.findOne(clientRepresentativeId, {
			relations: ['client'],
		});
		if (!clientRepresentative) {
			throw new NotFoundException(`Could not find client representative with id ${clientRepresentativeId}`);
		}
		return clientRepresentative;
	}

	async createClientRepresentative(
		firstName: string,
		lastName: string,
		email: string,
		clientId: number,
	): Promise<ClientRepresentativeEntity> {
		const clientEntity = await this.clientService.getClientInfo(clientId);

		const existingRepresentative = await this.clientRepresentativeRepository.findOne({ where: { email } });
		if (existingRepresentative) {
			throw new BadRequestException(`Client Representative with email ${email} already exists`);
		}

		return this.clientRepresentativeRepository.save({ firstName, lastName, email, client: clientEntity });
	}

	async getRepresentatives(clientId: number): Promise<ClientRepresentativeEntity[]> {
		const clientEntity = await this.clientService.getClientInfo(clientId);
		const clientRepresentatives = await this.clientRepresentativeRepository.find({
			where: { client: clientEntity },
		});

		return clientRepresentatives;
	}
}
