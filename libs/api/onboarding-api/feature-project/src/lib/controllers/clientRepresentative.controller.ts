import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientEntity, ClientRepresentativeEntity } from '@tempus/api/shared/entity';
import { JwtAuthGuard, Roles, RolesGuard } from '@tempus/api/shared/feature-auth';
import { ClientRepresentative, RoleType } from '@tempus/shared-domain';
import { ClientRepresentativeService } from '../services/clientRepresentative.service';
import { Client } from '@microsoft/microsoft-graph-client';

@ApiTags('ClientRepresentatives')
@Controller('clientRepresentative')
export class ClientRepresentativeController {
	constructor(private clientRepresentativeService: ClientRepresentativeService) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.BUSINESS_OWNER)
	@Get('/client/:clientId')
	async createProject(@Param('clientId') clientId: number): Promise<ClientRepresentativeEntity[]> {
		return this.clientRepresentativeService.getRepresentatives(clientId);
	}

	@Get('/:email')
	async getClient(@Param('email') email: string): Promise<ClientEntity>{
		return this.clientRepresentativeService.getClientByRepresentative(email);
	}
}
