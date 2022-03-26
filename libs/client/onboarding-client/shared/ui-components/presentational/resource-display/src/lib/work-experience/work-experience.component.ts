import { Component, Input } from '@angular/core';
import { formatDateRange, formatAddress, formatName } from '@tempus/shared/util';
import { ICreateExperienceDto } from '@tempus/shared-domain';

@Component({
	selector: 'tempus-resource-display-work-experience',
	templateUrl: './work-experience.component.html',
	styleUrls: ['./work-experience.component.scss'],
})
export class WorkExperienceComponent {
	@Input()
	workExperiences: Array<ICreateExperienceDto> = [];

	@Input()
	experiencesSummary = '';

	formatDate(startDate: Date, endDate: Date) {
		return formatDateRange(new Date(startDate), new Date(endDate));
	}

	formatAddress(country: string, state: string, city: string) {
		return formatAddress(country, state, city);
	}
}
