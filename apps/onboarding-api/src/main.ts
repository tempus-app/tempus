/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { applyDecorators, INestApplication, Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app/app.module'
import { ConfigService } from '@nestjs/config'
import { HttpErrorFilter } from '@tempus/core'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)
  const globalPrefix = 'api'

  setupSwagger(app);

  app.setGlobalPrefix(globalPrefix)
  app.useGlobalFilters(new HttpErrorFilter(config))
  const port = process.env.PORT || 3333
  await app.listen(port)
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`)
  Logger.log(`Running in ${config.get('environment')} mode`)
}

bootstrap()


function setupSwagger(app: INestApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Tempus')
    .setDescription('The tempus API')
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
}