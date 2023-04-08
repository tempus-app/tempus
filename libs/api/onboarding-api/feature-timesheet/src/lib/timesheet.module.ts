import { Module } from '@nestjs/common';
import { TimesheetEntryService, TimesheetService } from './services';
import { ApiSharedEntityModule } from '@tempus/api/shared/entity';
import { CommonModule } from '@tempus/api/shared/feature-common';
import { TimesheetController } from './controllers/timesheet.controller';
import { TimesheetEntryController } from './controllers/timesheetEntry.controller';
import { AccountModule } from '@tempus/onboarding-api/feature-account';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [ApiSharedEntityModule, AccountModule, ConfigModule, CommonModule],
	controllers: [TimesheetController, TimesheetEntryController],
	providers: [TimesheetService, TimesheetEntryService],
	exports: [TimesheetService, TimesheetEntryService],
})
export class TimesheetModule {}
