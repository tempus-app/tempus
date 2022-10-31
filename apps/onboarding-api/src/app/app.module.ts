import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CoreModule } from '@tempus/api/shared/feature-core';
import { AccountModule } from '@tempus/onboarding-api/feature-account';
import { ProfileModule } from '@tempus/onboarding-api/feature-profile';
import { EmailModule } from '@tempus/api/shared/feature-email';
import { ProjectModule } from '@tempus/onboarding-api/feature-project';
import { PdfgeneratorModule } from '@tempus/api/shared/feature-pdfgenerator';
import { AuthModule } from '@tempus/api/shared/feature-auth';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ApiSharedEntityModule } from '@tempus/api/shared/entity';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ApiSharedLoggingModule, LoggerMiddleware } from '@tempus/api/shared/logging';
import { LoggerModule } from 'nestjs-pino';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
	imports: [
		ConfigModule.forRoot(),
		LoggerModule.forRoot({
			pinoHttp: {
				customProps: (req, res) => ({
					context: 'HTTP',
				}),
				transport: {
					target: 'pino-pretty',
				},
			},
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, './', 'onboarding-client'),
		}),
		CoreModule,
		ApiSharedEntityModule,
		AccountModule,
		ProfileModule,
		ProjectModule,
		EmailModule,
		PdfgeneratorModule,
		AuthModule,
		ApiSharedLoggingModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
