import { Injectable } from '@nestjs/common';
import { CommonService } from '@tempus/api/shared/feature-common';

@Injectable()
export class TimesheetService {
	constructor(private commonService: CommonService) {}
}
