/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

// need two imports so that we can log when the app starts, as that uses the NestJS logging.
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { HttpErrorFilter } from '@tempus/api/shared/feature-core';
import { AppModule } from './app/app.module';

function setupSwagger(app: INestApplication) {
	app.setGlobalPrefix('onboarding');
	const swaggerConfig = new DocumentBuilder()
		.setTitle('Onboarding')
		.setDescription('The Tempus onboarding API')
		.setVersion('0.0.1')
		.build();

	const document = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	const config = app.get(ConfigService);
	const globalPrefix = 'onboarding';

	app.useGlobalPipes(new ValidationPipe());
	setupSwagger(app);
	app.setGlobalPrefix(globalPrefix);
	app.useGlobalFilters(new HttpErrorFilter(config));
	const port = process.env.PORT || 3000;
	await app.listen(port);
	Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
	Logger.log(`Running in ${config.get('environment')} mode`);
}

bootstrap();
