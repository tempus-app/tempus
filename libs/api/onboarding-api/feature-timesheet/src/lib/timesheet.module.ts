import { Module } from '@nestjs/common';
import { TimesheetService } from './services';
import { ApiSharedEntityModule } from '@tempus/api/shared/entity';
import { CommonModule } from '@tempus/api/shared/feature-common';
import { TimesheetController } from './controllers/timesheet.controller';
import { AccountModule } from '@tempus/onboarding-api/feature-account';
import { ConfigModule } from '@nestjs/config';
import { ProjectModule } from '@tempus/onboarding-api/feature-project';

@Module({
	imports: [ApiSharedEntityModule, AccountModule, ProjectModule, ConfigModule, CommonModule],
	controllers: [TimesheetController],
	providers: [TimesheetService],
	exports: [TimesheetService],
})
export class TimesheetModule {}
