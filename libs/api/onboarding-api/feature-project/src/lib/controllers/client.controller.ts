import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateClientDto, UpdateClientDto } from '@tempus/api/shared/dto';
import { JwtAuthGuard, Roles, RolesGuard } from '@tempus/api/shared/feature-auth';
import { Client, RoleType } from '@tempus/shared-domain';
import { ClientService } from '../services/client.service';

@ApiTags('Client')
@Controller('client')
export class ClientController {
	constructor(private clientService: ClientService) {}

	@UseGuards(JwtAuthGuard)
	@Get('/:clientId')
	async getClient(@Param('clientId') clientId: number) {
		return this.clientService.getClient(clientId);
	}

	@UseGuards(JwtAuthGuard)
	@Get('')
	async getAll() {
		return this.clientService.getAll();
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.BUSINESS_OWNER, RoleType.SUPERVISOR)
	@Post('/')
	async createClient(@Body() createClientDto: CreateClientDto): Promise<Client> {
		return this.clientService.createClient(createClientDto);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.BUSINESS_OWNER, RoleType.SUPERVISOR)
	@Patch('/:clientId')
	async editClient(@Body() updateClientDto: UpdateClientDto): Promise<Client> {
		return this.clientService.updateClient(updateClientDto);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.BUSINESS_OWNER, RoleType.SUPERVISOR)
	@Delete('/:clientId')
	async deleteClient(@Param('clientId') clientId: number) {
		return this.clientService.deleteClient(clientId);
	}
}
