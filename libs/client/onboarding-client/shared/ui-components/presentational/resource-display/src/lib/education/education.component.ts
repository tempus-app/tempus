import { Component, Input } from '@angular/core';
import { formatDateRange, formatAddress, formatName } from '@tempus/client/shared/util';
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

	formatDate(startDate: Date, endDate: Date) {
		return formatDateRange(new Date(startDate), new Date(endDate));
	}

	formatAddress(country: string, state: string, city: string) {
		return formatAddress(country, state, city);
	}
}
