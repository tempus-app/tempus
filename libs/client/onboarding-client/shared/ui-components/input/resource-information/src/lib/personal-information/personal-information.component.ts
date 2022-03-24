import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { InputType } from '@tempus/client/shared/ui-components/input';
import { Country, State } from 'country-state-city';

@Component({
	selector: 'tempus-resource-info-personal-information',
	templateUrl: './personal-information.component.html',
	styleUrls: ['./personal-information.component.scss'],
})
export class PersonalInformationComponent implements OnInit {
	myInfoForm = this.fb.group({
		firstName: ['', Validators.required],
		lastName: ['', Validators.required],
		profileSummary: '',
		// Taken from https://stackoverflow.com/questions/16699007/regular-expression-to-match-standard-10-digit-phone-number
		phoneNumber: ['', [Validators.required, Validators.pattern(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)]],
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
				/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
			),
		],
		country: ['', Validators.required],
		state: ['', Validators.required],
		city: ['', Validators.required],
	});

	countries: string[] = Country.getAllCountries().map(country => {
		return country.name;
	});

	states: string[] = State.getAllStates().map(state => {
		return state.name;
	});

	InputType = InputType;

	@Output() formGroup = new EventEmitter();

	@Output() formIsValid = new EventEmitter<boolean>();

	constructor(private fb: FormBuilder) {}

	ngOnInit(): void {
		this.formGroup.emit(this.myInfoForm);
	}

	updateStateOptions(inputtedCountry: string) {
		const countryCode = Country.getAllCountries().find(country => country.name === inputtedCountry);
		if (countryCode != null)
			this.states = State.getStatesOfCountry(countryCode.isoCode).map(state => {
				return state.name;
			});
	}
}
