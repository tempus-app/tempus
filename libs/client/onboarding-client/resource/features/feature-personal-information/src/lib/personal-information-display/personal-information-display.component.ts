import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { UserType } from '@tempus/client/shared/ui-components/persistent';
import { ButtonType } from '@tempus/client/shared/ui-components/presentational';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ICreateLocationDto, IUpdateResourceDto } from '@tempus/shared-domain';
import { TempusResourceState, updateUserInfo } from '@tempus/client/onboarding-client/resource/data-access';
import { OnboardingClientResourceService } from '@tempus/client/onboarding-client/shared/data-access';

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

	calEmail = '';

	email = '';

	resume: File | null = null;

	phoneNumber = '';

	country = '';

	state = '';

	city = '';

	linkedInLink = '';

	githubLink = '';

	otherLink = '';

	ButtonType = ButtonType;

	editViewEnabled = false;

	profilePrefix = 'onboardingResourceEditPersonalInformation.';

	personalInfoForm = this.fb.group({});

	constructor(
		private resourceService: OnboardingClientResourceService,
		private translateService: TranslateService,
		private fb: FormBuilder,
		private store: Store<TempusResourceState>,
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
			this.calEmail = resData.calEmail;
			this.phoneNumber = resData.phoneNumber;
			this.linkedInLink = resData.linkedInLink;
			this.githubLink = resData.githubLink;
			this.otherLink = resData.otherLink;
			this.fullName = `${resData.firstName} ${resData.lastName}`;
		});

		this.resourceService.getResourceOriginalResumeById(this.userId).subscribe(resumeBlob => {
			this.resume = new File([resumeBlob], 'original-resume.pdf');
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
			githubLink: this.personalInfoForm.get('githubLink')?.value,
			otherLink: this.personalInfoForm.get('otherLink')?.value,
		} as IUpdateResourceDto;
	}

	isValid() {
		return this.personalInfoForm?.valid;
	}

	submitChanges() {
		const updatedPersonalInformation = this.updatePersonalInformation();
		this.editViewEnabled = false;
		this.store.dispatch(
			updateUserInfo({
				updatedPersonalInformation,
			}),
		);
		window.location.reload();
	}
}
