import { Component, Input } from '@angular/core';
import { formatDateRange, formatAddress } from '@tempus/client/shared/util';
import { ICreateEducationDto } from '@tempus/shared-domain';

@Component({
	selector: 'tempus-resource-display-education',
	templateUrl: './education.component.html',
	styleUrls: ['./education.component.scss'],
})
export class EducationComponent {
	@Input()
	educations: Array<ICreateEducationDto> = [];

	@Input()
	educationsSummary = '';

	// eslint-disable-next-line class-methods-use-this
	formatDate(startDate: Date, endDate: Date | null) {
		return formatDateRange(new Date(startDate), endDate ? new Date(endDate) : endDate);
	}

	// eslint-disable-next-line class-methods-use-this
	formatAddress(country: string, state: string, city: string) {
		return formatAddress(country, state, city);
	}
}
