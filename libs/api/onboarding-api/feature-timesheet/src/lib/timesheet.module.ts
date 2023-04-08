import { Module } from '@nestjs/common';
import { TimesheetEntryService, TimesheetService } from './services';
import { ApiSharedEntityModule } from '@tempus/api/shared/entity';
import { CommonModule } from '@tempus/api/shared/feature-common';
import { TimesheetController } from './controllers/timesheet.controller';
import { TimesheetEntryController } from './controllers/timesheetEntry.controller';
import { AccountModule } from '@tempus/onboarding-api/feature-account';

@Module({
	imports: [ApiSharedEntityModule, AccountModule, CommonModule],
	controllers: [TimesheetController, TimesheetEntryController],
	providers: [TimesheetService, TimesheetEntryService],
	exports: [TimesheetService, TimesheetEntryService],
})
export class TimesheetModule {}
