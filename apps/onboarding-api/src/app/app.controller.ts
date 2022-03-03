import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '@tempus/shared-domain';

import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Post('create-user')
	async createUserSwaggerExample(@Body() createUserDto: CreateUserDto) {
		this.appService.createUser();
	}

	@Get('hello')
	getData() {
		return this.appService.getData();
	}

	@Get('create')
	makeUser() {
		this.appService.createUser();
	}

	@Get('getuser')
	getUser() {
		return this.appService.getUser();
	}

	@Get('pdf')
	async getTest(@Res() res: Response): Promise<void> {
		this.appService.getPdf(res);
	}
}
