import { NestFactory } from '@nestjs/core';
import { SeederService, SeedModule } from '../../libs/api/shared/feature-seed/src';

async function bootstrap() {
	const appContext = await NestFactory.createApplicationContext(SeedModule);

	try {
		const seeder = appContext.get(SeederService);
		await seeder.clear();
		appContext.close();
	} catch (e) {
		console.error(e);
	} finally {
		appContext.close();
	}
}
bootstrap();
