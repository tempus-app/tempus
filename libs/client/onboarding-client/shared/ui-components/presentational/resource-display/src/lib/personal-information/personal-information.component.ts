import { Component, Input } from '@angular/core';
import { formatDateRange, formatAddress, formatName } from '@tempus/shared/util';

@Component({
	selector: 'tempus-resource-display-personal-information',
	templateUrl: './personal-information.component.html',
	styleUrls: ['./personal-information.component.scss'],
})
export class PersonalInformationComponent {
	@Input()
	firstName: string = '';

	@Input()
	lastName: string = '';

	@Input()
	country: string = '';

	@Input()
	state: string = '';

	@Input()
	city: string = '';

	@Input()
	phoneNumber: string = '';

	@Input()
	email: string = '';

	@Input()
	resume: File | null = null;

	@Input()
	linkedInLink: string = '';

	@Input()
	githubLink: string = '';

	@Input()
	otherLink: string = '';

	@Input()
	profileSummary: string = '';

	formatDate(startDate: Date, endDate: Date) {
		return formatDateRange(new Date(startDate), new Date(endDate));
	}

	formatAddress(country: string, state: string, city: string) {
		return formatAddress(country, state, city);
	}

	formatName(first: string, last: string) {
		return formatName(first, last);
	}

	downloadResume() {
		if (this.resume !== null) {
			let url = URL.createObjectURL(this.resume);
			let link = document.createElement('a');
			link.href = url;
			link.download = this.resume?.name || 'download';
			link.click();
			URL.revokeObjectURL(url);
		}
	}
}
