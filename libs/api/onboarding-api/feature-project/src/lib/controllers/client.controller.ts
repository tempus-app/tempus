import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateClientDto, UpdateClientDto } from '@tempus/api/shared/dto';
import { JwtAuthGuard } from '@tempus/api/shared/feature-auth';
import { Client } from '@tempus/shared-domain';
import { ClientService } from '../services/client.service';

@ApiTags('Client')
@Controller('client')
export class LinkController {
	constructor(private clientService: ClientService) {}

	@UseGuards(JwtAuthGuard)
	@Get('/:clientId')
	async getClient(@Param('clientId') clientId: number) {
		return this.clientService.getClient(clientId);
	}

	@UseGuards(JwtAuthGuard)
	@Post('/')
	async createClient(@Body() createClientDto: CreateClientDto): Promise<Client> {
		return this.clientService.createClient(createClientDto);
	}

	@UseGuards(JwtAuthGuard)
	@Patch('/:clientId')
	async editClient(@Body() updateClientDto: UpdateClientDto): Promise<Client> {
		return this.clientService.updateClient(updateClientDto);
	}

	@UseGuards(JwtAuthGuard)
	@Delete('/:clientId')
	async getLink(@Param('clientId') clientId: number) {
		return this.clientService.deleteClient(clientId);
	}
}
