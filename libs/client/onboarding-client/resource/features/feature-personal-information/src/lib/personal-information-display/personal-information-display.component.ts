import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { UserType } from '@tempus/client/shared/ui-components/persistent';
import { ButtonType } from '@tempus/client/shared/ui-components/presentational';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ICreateLocationDto, IUpdateResourceDto } from '@tempus/shared-domain';
import { TempusResourceState, updateUserInfo } from '@tempus/client/onboarding-client/resource/data-access';
import {
	getResourceInformation,
	getResourceOriginalResumeById,
	OnboardingClientResourceService,
	OnboardingClientState,
	selectResourceDetails,
	selectResourceOriginalResume,
	SessionStorageKey,
} from '@tempus/client/onboarding-client/shared/data-access';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'tempus-personal-information-display',
	templateUrl: './personal-information-display.component.html',
	styleUrls: ['./personal-information-display.component.scss'],
})
export class PersonalInformationDisplayComponent implements OnInit {
	$destroyed = new Subject<void>();

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
		private sharedStore: Store<OnboardingClientState>,
	) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
	}

	ngOnInit(): void {
		this.sharedStore.dispatch(getResourceInformation());

		this.sharedStore
			.select(selectResourceDetails)
			.pipe(takeUntil(this.$destroyed))
			.subscribe(data => {
				this.userId = data.userId;
				this.firstName = data.firstName || '';
				this.lastName = data.lastName || '';
				this.city = data.city || '';
				this.state = data.province || '';
				this.country = data.country || '';
				this.phoneNumber = data.phoneNumber || '';
				this.email = data.email || '';
				this.calEmail = data.calEmail || '';
				this.linkedInLink = data.linkedInLink || '';
				this.githubLink = data.githubLink || '';
				this.otherLink = data.otherLink || '';
				this.fullName = `${data.firstName} ${data.lastName}`;
			});

		this.sharedStore.dispatch(getResourceOriginalResumeById({ resourceId: this.userId }));

		this.sharedStore
			.select(selectResourceOriginalResume)
			.pipe(takeUntil(this.$destroyed))
			.subscribe(blob => {
				if (blob) {
					this.resume = new File([blob], 'original-resume.pdf');
				}
			});

		// this.resourceService.getResourceOriginalResumeById(this.userId).subscribe(resumeBlob => {
		// 	this.resume = new File([resumeBlob], 'original-resume.pdf');
		// });
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
		const firstName = this.personalInfoForm.get('firstName')?.value;
		const lastName = this.personalInfoForm.get('lastName')?.value;
		sessionStorage.setItem(SessionStorageKey.TEMPUS_FIRST_NAME, firstName);
		sessionStorage.setItem(SessionStorageKey.TEMPUS_LAST_NAME, lastName);
		return {
			id: this.userId,
			firstName,
			lastName,
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
