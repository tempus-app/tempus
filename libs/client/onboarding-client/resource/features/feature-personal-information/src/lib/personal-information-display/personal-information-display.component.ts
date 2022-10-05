import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
	OnboardingClientResourceService,
	OnboardingClientState,
} from '@tempus/client/onboarding-client/shared/data-access';
import { UserType } from '@tempus/client/shared/ui-components/persistent';
import { take } from 'rxjs';
import { ButtonType } from '@tempus/client/shared/ui-components/presentational';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ICreateLocationDto, IUpdateResourceDto } from '@tempus/shared-domain';

@Component({
	selector: 'tempus-personal-information-display',
	templateUrl: './personal-information-display.component.html',
	styleUrls: ['./personal-information-display.component.scss'],
})
export class PersonalInformationDisplayComponent implements OnInit {
	UserType = UserType;

	userId = 0;

	firstName = '';

	lastName = '';

	fullName = '';

	email = '';

	phoneNumber = '';

	country = '';

	state = '';

	city = '';

	linkedInLink = '';

	githubLink = '';

	otherLink = '';

	ButtonType = ButtonType;

	editViewEnabled = false;

	profilePrefix = 'onboardingResourceEditProfile.';

	personalInfoForm = this.fb.group({});

	constructor(
		private resourceService: OnboardingClientResourceService,
		private translateService: TranslateService,
		private fb: FormBuilder,
	) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
	}

	ngOnInit(): void {
		this.resourceService.getResourceInformation().subscribe(resData => {
			this.userId = resData.id;
			this.firstName = resData.firstName;
			this.lastName = resData.lastName;
			this.email = resData.email;
			this.city = resData.location.city;
			this.state = resData.location.province;
			this.country = resData.location.country;
			this.phoneNumber = resData.phoneNumber;
			this.email = resData.email;
			this.phoneNumber = resData.phoneNumber;
			this.linkedInLink = resData.linkedInLink;
			this.githubLink = resData.githubLink;
			this.otherLink = resData.otherLink;
			this.fullName = `${resData.firstName} ${resData.lastName}`;
		});
	}

	loadPersonalInfo(eventData: FormGroup) {
		this.personalInfoForm = eventData;
	}

	openEditView() {
		this.editViewEnabled = true;
	}

	closeEditView() {
		this.editViewEnabled = false;
	}

	updatePersonalInformation() {
		const locationsDto: ICreateLocationDto = {
			city: this.personalInfoForm.get('city')?.value,
			province: this.personalInfoForm.get('state')?.value,
			country: this.personalInfoForm.get('country')?.value,
		};
		return {
			id: this.userId,
			firstName: this.personalInfoForm.get('firstName')?.value,
			lastName: this.personalInfoForm.get('lastName')?.value,
			email: this.personalInfoForm.get('email')?.value,
			location: locationsDto,
			phoneNumber: this.personalInfoForm.get('phoneNumber')?.value,
			linkedInLink: this.personalInfoForm.get('linkedInLink')?.value,
			githubLink: this.personalInfoForm.get('otherLink')?.value,
			otherLink: this.personalInfoForm.get('otherLink')?.value,
		} as IUpdateResourceDto;
	}

	submitChanges() {
		const updatedPersonalInformation = this.updatePersonalInformation();
		this.resourceService.editResourcePersonalInformation(updatedPersonalInformation).pipe(take(1)).subscribe();
		this.editViewEnabled = false;
		window.location.reload();
	}
}
