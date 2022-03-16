import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Country, State } from 'country-state-city';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
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
export class MyInfoOneComponent implements OnInit {
	myInfoForm = this.fb.group({
		firstName: ['', Validators.required],
		lastName: ['', Validators.required],
		phoneNumber: ['', Validators.required],
		country: ['', Validators.required],
		state: ['', Validators.required],
		city: ['', Validators.required],
	});

	InputType = InputType;

	countries: string[] = Country.getAllCountries().map(country => {
		return country.name;
	});

	states: string[] = State.getAllStates().map(state => {
		return state.name;
	});

	@Output() formIsValid = new EventEmitter<boolean>();

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		private store: Store<SignupState>,
	) {}

	ngOnInit() {
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
					country: createResourceDto.location.country,
					state: createResourceDto.location.province,
					city: createResourceDto.location.city,
				});
			});
	}

	updateStateOptions(inputtedCountry: string) {
		const countryCode = Country.getAllCountries().find(country => country.name === inputtedCountry);
		if (countryCode != null)
			this.states = State.getStatesOfCountry(countryCode.isoCode).map(state => {
				return state.name;
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
					location: {
						city: this.myInfoForm.get('city')?.value,
						province: this.myInfoForm.get('state')?.value,
						country: this.myInfoForm.get('country')?.value,
					},
				}),
			);
			this.router.navigate(['../myinfotwo'], { relativeTo: this.route });
		}
	}

	backStep() {
		this.router.navigate(['../uploadresume'], { relativeTo: this.route });
	}
}
