import { Module } from '@nestjs/common';
import { CoreModule } from '@tempus/api/shared/feature-core';
import { AccountModule } from '@tempus/onboarding-api/feature-account';
import { ProfileModule } from '@tempus/onboarding-api/feature-profile';
import { EmailModule } from '@tempus/api/shared/feature-email';
import { PdfgeneratorModule } from '@tempus/api/shared/feature-pdfgenerator';
import { AuthModule } from '@tempus/api/shared/feature-auth';
import { ApiSharedEntityModule } from '@tempus/api/shared/entity';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
	imports: [
		CoreModule,
		ApiSharedEntityModule,
		AccountModule,
		ProfileModule,
		EmailModule,
		PdfgeneratorModule,
		AuthModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
