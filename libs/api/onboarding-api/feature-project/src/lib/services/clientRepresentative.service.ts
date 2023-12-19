import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity, ClientRepresentativeEntity } from '@tempus/api/shared/entity';
import { Repository } from 'typeorm';
import { ClientService } from './client.service';
import { UserService } from '@tempus/onboarding-api/feature-account';
import { RoleType } from '@tempus/shared-domain';
import { Client } from '@microsoft/microsoft-graph-client';

@Injectable()
export class ClientRepresentativeService {
	constructor(
		@InjectRepository(ClientRepresentativeEntity)
		private clientRepresentativeRepository: Repository<ClientRepresentativeEntity>,
		private clientService: ClientService,
		private userService: UserService,
	) {}

	async getClientRepresentativeInfo(clientRepresentativeId: number): Promise<ClientRepresentativeEntity> {
		const clientRepresentative = await this.clientRepresentativeRepository.findOne(clientRepresentativeId, {
			relations: ['client', 'projects'],
		});
		if (!clientRepresentative) {
			throw new NotFoundException(`Could not find client representative with id ${clientRepresentativeId}`);
		}
		return clientRepresentative;
	}

	async getClientRepresentativeByEmail(emailRep: string): Promise<ClientRepresentativeEntity> {
		const clientRepresentative = await this.clientRepresentativeRepository.findOne({
			where: { email: emailRep },
			relations: ['client'],
		});
		if (!clientRepresentative) {
			throw new NotFoundException(`Could not find client representative with email ${emailRep}`);
		}
		return clientRepresentative;
	}

	async getClientByRepresentative(email: string): Promise<ClientEntity> {
		const clientRepresentative = await this.getClientRepresentativeByEmail(email);

		return clientRepresentative.client;
	}

	async createClientRepresentative(
		firstName: string,
		lastName: string,
		email: string,
		clientId: number,
	): Promise<ClientRepresentativeEntity> {
		const active = true;
		const clientEntity = await this.clientService.getClientInfo(clientId);

		const existingRepresentative = await this.clientRepresentativeRepository.findOne({ where: { email } });
		if (existingRepresentative) {
			throw new BadRequestException(`Client Representative with email ${email} already exists`);
		}

		const clientRepresentative = await this.clientRepresentativeRepository.save({
			firstName,
			lastName,
			email,
			client: clientEntity,
			active,
		});

		if (clientRepresentative) {
			this.userService.createUser({
				firstName: clientRepresentative.firstName,
				lastName: clientRepresentative.lastName,
				email: clientRepresentative.email,
				password: 'IamAClient',
				roles: [RoleType.CLIENT],
				active: true,
			});
		}

		return clientRepresentative;
	}

	async getRepresentatives(clientId: number): Promise<ClientRepresentativeEntity[]> {
		const clientEntity = await this.clientService.getClientInfo(clientId);
		const clientRepresentatives = await this.clientRepresentativeRepository.find({
			where: { client: clientEntity },
		});

		return clientRepresentatives;
	}
}
