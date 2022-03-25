import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { filter, switchMap, take } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputType } from '@tempus/client/shared/ui-components/input';
import {
	createUserDetails,
	selectResourceData,
	selectUserDetailsCreated,
	SignupState,
} from '@tempus/client/onboarding-client/signup/data-access';
import { Store } from '@ngrx/store';

@Component({
	selector: 'tempus-my-info-one',
	templateUrl: './my-info-one.component.html',
	styleUrls: ['./my-info-one.component.scss'],
})
export class MyInfoOneComponent {
	myInfoForm = this.fb.group({});
	firstName = '';
	lastName = '';
	phoneNumber = '';
	linkedInLink = '';
	githubLink = '';
	otherLink = '';
	country = '';
	state = '';
	city = '';
	profileSummary = '';

	InputType = InputType;

	@Output() formIsValid = new EventEmitter<boolean>();

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		private store: Store<SignupState>,
	) {}

	loadFormGroup(eventData: FormGroup) {
		this.myInfoForm = eventData;
		this.store
			.select(selectUserDetailsCreated)
			.pipe(
				take(1),
				filter(created => created),
				switchMap(_ => this.store.select(selectResourceData)),
				take(1),
			)
			.subscribe(createResourceDto => {
				this.myInfoForm.setValue({
					firstName: createResourceDto.firstName,
					lastName: createResourceDto.lastName,
					phoneNumber: createResourceDto.phoneNumber,
					linkedInLink: createResourceDto.linkedInLink,
					githubLink: createResourceDto.githubLink,
					otherLink: createResourceDto.otherLink,
					country: createResourceDto.location.country,
					state: createResourceDto.location.province,
					city: createResourceDto.location.city,
					profileSummary: createResourceDto.profileSummary,
				});
			});
	}

	nextStep() {
		this.myInfoForm?.markAllAsTouched();
		if (this.myInfoForm?.valid) {
			this.store.dispatch(
				createUserDetails({
					firstName: this.myInfoForm.get('firstName')?.value,
					lastName: this.myInfoForm.get('lastName')?.value,
					phoneNumber: this.myInfoForm.get('phoneNumber')?.value,
					linkedInLink: this.myInfoForm.get('linkedInLink')?.value,
					githubLink: this.myInfoForm.get('githubLink')?.value,
					otherLink: this.myInfoForm.get('otherLink')?.value,
					location: {
						city: this.myInfoForm.get('city')?.value,
						province: this.myInfoForm.get('state')?.value,
						country: this.myInfoForm.get('country')?.value,
					},
					profileSummary: this.myInfoForm.get('profileSummary')?.value,
				}),
			);
			this.store
				.select(selectResourceData)
				.pipe(take(1))
				.subscribe(resData => {
					this.firstName = resData?.firstName;
					this.lastName = resData?.lastName;
					this.phoneNumber = resData?.phoneNumber;
					this.country = resData?.location?.country;
					this.state = resData?.location?.province;
					this.city = resData?.location?.city;
					this.linkedInLink = resData?.linkedInLink;
					this.githubLink = resData?.githubLink;
					this.otherLink = resData?.otherLink;
					this.profileSummary = resData?.profileSummary;
				});
			this.router.navigate(['../myinfotwo'], { relativeTo: this.route });
		}
	}

	backStep() {
		this.router.navigate(['../uploadresume'], { relativeTo: this.route });
	}
}
