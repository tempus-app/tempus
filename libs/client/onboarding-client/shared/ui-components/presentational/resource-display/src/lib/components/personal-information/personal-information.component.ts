import { Component, Input } from '@angular/core';
import { formatDateRange, formatAddress, formatName } from '@tempus/client/shared/util';

@Component({
	selector: 'tempus-resource-display-personal-information',
	templateUrl: './personal-information.component.html',
	styleUrls: ['./personal-information.component.scss'],
})
export class PersonalInformationComponent {
	@Input()
	firstName = '';

	@Input()
	lastName = '';

	@Input()
	country = '';

	@Input()
	state = '';

	@Input()
	city = '';

	@Input()
	phoneNumber = '';

	@Input()
	email = '';

	@Input()
	resume: File | null = null;

	@Input()
	linkedInLink = '';

	@Input()
	githubLink = '';

	@Input()
	otherLink = '';

	@Input()
	profileSummary = '';

	static formatDate(startDate: Date, endDate: Date) {
		return formatDateRange(new Date(startDate), new Date(endDate));
	}

	static formatAddress(country: string, state: string, city: string) {
		return formatAddress(country, state, city);
	}

	static formatName(first: string, last: string) {
		return formatName(first, last);
	}

	downloadResume() {
		if (this.resume !== null) {
			const url = URL.createObjectURL(this.resume);
			const link = document.createElement('a');
			link.href = url;
			link.download = this.resume?.name || 'download';
			link.click();
			URL.revokeObjectURL(url);
		}
	}
}
