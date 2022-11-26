import { Component, Input } from '@angular/core';
import { OnboardingClientResourceService } from '@tempus/client/onboarding-client/shared/data-access';
import { formatAddress, formatName } from '@tempus/client/shared/util';

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
	calEmail = '';

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

	personalInfoPrefix = 'onboardingClient.presentational.personalInfo.';

	constructor(private resourceService: OnboardingClientResourceService) {}

	formatAddress() {
		return formatAddress(this.country, this.state, this.city);
	}

	formatName() {
		return formatName(this.firstName, this.lastName);
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
