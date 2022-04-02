import { Component, Input } from '@angular/core';
import { formatDateRange, formatAddress } from '@tempus/client/shared/util';
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

	// eslint-disable-next-line class-methods-use-this
	formatDate(startDate: Date, endDate: Date | null) {
		return formatDateRange(new Date(startDate), endDate ? new Date(endDate) : endDate);
	}

	// eslint-disable-next-line class-methods-use-this
	formatAddress(country: string, state: string, city: string) {
		return formatAddress(country, state, city);
	}
}
