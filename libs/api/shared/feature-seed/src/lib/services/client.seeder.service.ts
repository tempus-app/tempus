import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from '@tempus/api/shared/entity';
import { Repository } from 'typeorm';
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import { ClientService } from '@tempus/onboarding-api/feature-project';
import { CreateClientDto } from '@tempus/api/shared/dto';

/**
 *
 */
@Injectable()
export class ClientSeederService {
	/**
	 * Seeds the user database with test data
	 * @param clientRepository user database repository
	 * @param clientService
	 */
	constructor(
		@InjectRepository(ClientEntity)
		private clientRepository: Repository<ClientEntity>,
		private clientService: ClientService,
	) {}

	/**
	 * drops all entities in the client repository
	 */
	async clear() {
		await this.clientRepository.query('DELETE from client_entity CASCADE');
	}

	/**
	 * creates a specifed number of client entites
	 * @param count number of entities to create
	 * @returns array of created clients
	 */
	async seed(count = 3): Promise<ClientEntity[]> {
		const createdClients: ClientEntity[] = [];

		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < count; i++) {
			const client: CreateClientDto = new CreateClientDto(faker.company.companyName());
			const createdClient = await this.clientService.createClient(client);
			createdClients.push(createdClient);
		}
		return createdClients;
	}
}
