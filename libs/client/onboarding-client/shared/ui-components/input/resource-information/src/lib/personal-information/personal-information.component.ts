/* eslint-disable no-useless-escape */
import { Component, Output, EventEmitter, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { InputType } from '@tempus/client/shared/ui-components/input';
import { Country, State } from 'country-state-city';

@Component({
	selector: 'tempus-resource-info-personal-information',
	templateUrl: './personal-information.component.html',
	styleUrls: ['./personal-information.component.scss'],
})
export class PersonalInformationComponent implements OnInit, OnChanges {
	myInfoForm = this.fb.group({
		firstName: ['', Validators.required],
		lastName: ['', Validators.required],
		profileSummary: '',
		// Taken from https://stackoverflow.com/questions/16699007/regular-expression-to-match-standard-10-digit-phone-number
		phoneNumber: [
			'',
			[
				Validators.required,
				Validators.pattern(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/),
			],
		],
		// Taken from https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
		linkedInLink: [
			'',
			Validators.pattern(
				/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
			),
		],
		githubLink: [
			'',
			Validators.pattern(
				/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
			),
		],
		otherLink: [
			'',
			Validators.pattern(
				// eslint-disable-next-line no-useless-escape
				/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
			),
		],
		country: ['', Validators.required],
		state: ['', Validators.required],
		city: ['', Validators.required],
	});

	personalInfoPrefix = 'onboardingClient.input.personalInfo.';

	commonPrefix = 'onboardingClient.input.common.';

	countries: string[] = Country.getAllCountries().map(country => {
		return country.name;
	});

	states: string[] = State.getAllStates().map(state => {
		return state.name;
	});

	InputType = InputType;

	@Input() firstName = '';

	@Input() lastName = '';

	@Input() phoneNumber = '';

	@Input() linkedInLink = '';

	@Input() githubLink = '';

	@Input() otherLink = '';

	@Input() country = '';

	@Input() state = '';

	@Input() city = '';

	@Input() profileSummary = '';

	@Input() showPersonalSummary = true;

	@Input() disablePersonalInfo = false;

	@Output() formGroup = new EventEmitter();

	@Output() formIsValid = new EventEmitter<boolean>();

	constructor(private fb: FormBuilder) {}

	ngOnInit(): void {
		this.loadStoreData();
		this.formGroup.emit(this.myInfoForm);
		this.myInfoForm.updateValueAndValidity({ onlySelf: false, emitEvent: true });

		if (this.disablePersonalInfo) {
			this.myInfoForm.controls.firstName.disable();
			this.myInfoForm.controls.lastName.disable();
			this.myInfoForm.controls.phoneNumber.disable();
			this.myInfoForm.controls.githubLink.disable();
			this.myInfoForm.controls.linkedInLink.disable();
			this.myInfoForm.controls.otherLink.disable();
			this.myInfoForm.controls.country.disable();
			this.myInfoForm.controls.city.disable();
			this.myInfoForm.controls.state.disable();
		}
	}

	loadStoreData() {
		this.myInfoForm.patchValue({
			firstName: this.firstName,
			lastName: this.lastName,
			phoneNumber: this.phoneNumber,
			linkedInLink: this.linkedInLink,
			githubLink: this.githubLink,
			otherLink: this.otherLink,
			country: this.country,
			state: this.state,
			city: this.city,
			profileSummary: this.profileSummary,
		});
	}

	updateStateOptions(inputtedCountry: string) {
		const countryCode = Country.getAllCountries().find(country => country.name === inputtedCountry);
		if (countryCode != null)
			this.states = State.getStatesOfCountry(countryCode.isoCode).map(state => {
				return state.name;
			});
	}

	ngOnChanges(changes: SimpleChanges) {
		this.updateStateOptions(changes.country.currentValue);
	}
}
