import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TimesheetService } from '../services/timesheet.service';

@ApiTags('Timesheet')
@Controller('timesheet')
export class TimesheetController {
	constructor(private timesheetService: TimesheetService) {}
}
