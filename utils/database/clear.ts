import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SeederService, SeedModule } from '../../libs/api/shared/feature-seed/src';

async function bootstrap() {
	const appContext = await NestFactory.createApplicationContext(SeedModule);
	const logger = appContext.get(Logger);
	try {
		const seeder = appContext.get(SeederService);
		await seeder.clear();
		appContext.close();
	} catch (e) {
		logger.error(e);
	} finally {
		appContext.close();
	}
}
bootstrap();
