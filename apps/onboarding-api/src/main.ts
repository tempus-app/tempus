/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { applyDecorators, Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app/app.module'
import { ConfigService } from '@nestjs/config'
import { HttpErrorFilter } from '@tempus/core'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)
  const globalPrefix = 'onboarding'
  app.setGlobalPrefix(globalPrefix)
  app.useGlobalFilters(new HttpErrorFilter(config))
  const port = process.env.PORT || 3333
  await app.listen(port)
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`)
  Logger.log(`Running in ${config.get('environment')} mode`)
}

bootstrap()
