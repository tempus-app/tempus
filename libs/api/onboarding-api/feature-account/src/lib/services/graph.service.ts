import 'isomorphic-fetch';
import generator from 'generate-password-ts';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';

import settings, { AppSettings } from 'azure-app-settings';
import { AzureAccount } from '@tempus/shared-domain';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceEntity } from '@tempus/api/shared/entity';
import { Repository } from 'typeorm';
import { User } from '@microsoft/microsoft-graph-types';

Injectable();
export class GraphService {
	constructor(
		@InjectRepository(ResourceEntity)
		private resourceRepository: Repository<ResourceEntity>,
	) {}

	azureSettings: AppSettings = settings;

	clientCredentials: ClientSecretCredential;

	appClient: Client | undefined;

	/**
	 * Configures a Microsoft Identity token to allow the app to call Microsoft Graph.
	 * Call this method before making any requests.
	 */
	initializeGraphAuthProvider() {
		if (!this.azureSettings) {
			throw new Error('Missing Azure settings');
		}

		this.clientCredentials = new ClientSecretCredential(
			this.azureSettings.tenantId,
			this.azureSettings.clientId,
			this.azureSettings.clientSecret,
		);

		if (!this.appClient) {
			const authProvider = new TokenCredentialAuthenticationProvider(this.clientCredentials, {
				scopes: ['https://graph.microsoft.com/.default'],
			});

			this.appClient = Client.initWithMiddleware({
				authProvider,
			});
		}
	}

	/**
	 * Creates a new Microsoft Azure AD user account with a temporary password.
	 * @param resourceId
	 * @returns AzureAccount with user and password
	 */
	async createUser(resourceId: number): Promise<AzureAccount> {
		this.initializeGraphAuthProvider();

		const { domain } = settings;

		const tempPassword = generator.generate({
			length: 10,
			numbers: true,
			symbols: true,
			strict: true,
		});

		const resource = await this.resourceRepository.findOne(resourceId, {
			relations: ['location'],
		});

		if (!resource) {
			throw new NotFoundException(`Could not find resource with id ${resourceId}`);
		}

		// Create unique email address
		let email = `${resource.firstName}.${resource.lastName}${domain}`;
		const existingUser = await this.resourceRepository.findOne({ where: { calEmail: email } });

		if (existingUser) {
			email = `${resource.firstName}.${resource.lastName}${resource.id}${domain}`;
		}

		const user = {
			accountEnabled: true,
			givenName: resource.firstName,
			surname: resource.lastName,
			displayName: `${resource.firstName} ${resource.lastName}`,
			mailNickname: `${resource.firstName}.${resource.lastName}`,
			userPrincipalName: email,
			businessPhones: [resource.phoneNumber],
			otherMails: [resource.email],
			country: resource.location.country,
			state: resource.location.province,
			city: resource.location.city,
			passwordProfile: {
				forceChangePasswordNextSignIn: true,
				password: tempPassword,
			},
		};

		try {
			// create Azure account
			const createdUser: User = await this.appClient.api('/users').post(user);
			const account: AzureAccount = { user: createdUser, temporaryPassword: tempPassword };

			// save calEmail
			resource.calEmail = account.user.userPrincipalName;
			await this.resourceRepository.save(resource);

			return account;
		} catch (e) {
			throw new BadRequestException(e);
		}
	}

	/**
	 * Delete the Microsoft Azure AD account associated with resourceId, only if the account was created by Tempus.
	 * @param resourceId
	 */
	async deleteUser(resourceId: number): Promise<void> {
		this.initializeGraphAuthProvider();

		const resourceEntity = await this.resourceRepository.findOne(resourceId);
		if (!resourceEntity) {
			throw new NotFoundException(`Could not find resource with id ${resourceId}`);
		}

		if (!resourceEntity.calEmail) {
			throw new Error(
				`The Outlook account for resource with id ${resourceId} was not created by Tempus. Please delete this account manually from Azure.`,
			);
		}

		try {
			const userPrincipalName = resourceEntity.calEmail;
			await this.appClient.api(`/users/${userPrincipalName}`).delete();
		} catch (e) {
			throw new BadRequestException(e);
		}
	}
}
