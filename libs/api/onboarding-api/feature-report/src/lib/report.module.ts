import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiSharedEntityModule } from '@tempus/api/shared/entity';
import { CommonModule } from '@tempus/api/shared/feature-common';
import { AccountModule } from '@tempus/onboarding-api/feature-account';
import { ReportController } from './controllers/report.controller';
import { ReportService } from './services';

@Module({
	imports: [ApiSharedEntityModule, AccountModule, ConfigModule, CommonModule],
	controllers: [ReportController],
	providers: [ReportService],
	exports: [ReportService],
})
export class ReportModule {}
