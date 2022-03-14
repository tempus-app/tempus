import { Component, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Country, State } from 'country-state-city';
import { Subject } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputType } from '@tempus/client/shared/ui-components/input';

@Component({
	selector: 'tempus-my-info-one',
	templateUrl: './my-info-one.component.html',
	styleUrls: ['./my-info-one.component.scss'],
})
export class MyInfoOneComponent implements OnDestroy {
	myInfoForm = this.fb.group({
		firstName: ['', Validators.required],
		lastName: ['', Validators.required],
		phoneNumber: ['', Validators.required],
		email: ['', [Validators.required, Validators.email]],
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

	destroyed = new Subject<void>();

	cols = '1';

	rows = '5';

	@Output() formIsValid = new EventEmitter<boolean>();

	constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {}

	ngOnDestroy() {
		this.destroyed.next();
		this.destroyed.complete();
	}

	updateStateOptions(inputtedCountry: string) {
		const countryCode = Country.getAllCountries().find(country => country.name === inputtedCountry);
		if (countryCode != null)
			this.states = State.getStatesOfCountry(countryCode.isoCode).map(state => {
				return state.name;
			});
	}

	nextStep() {
		this.router.navigate(['../myinfotwo'], { relativeTo: this.route });
	}

	backStep() {
		this.router.navigate(['../uploadresume'], { relativeTo: this.route });
	}
}
