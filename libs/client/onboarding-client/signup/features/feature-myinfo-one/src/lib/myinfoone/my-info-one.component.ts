import { Component, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Country, State } from 'country-state-city';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
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

	// Create a map to display breakpoint names for demonstration purposes.
	displayNameMap = new Map([
		[Breakpoints.XSmall, '1'],
		[Breakpoints.Small, 'Small'],
		[Breakpoints.Medium, 'Medium'],
		[Breakpoints.Large, 'Large'],
		[Breakpoints.XLarge, 'XLarge'],
	]);

	@Output() formIsValid = new EventEmitter<boolean>();

	constructor(breakpointObserver: BreakpointObserver, private fb: FormBuilder) {
		breakpointObserver
			.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
			.pipe(takeUntil(this.destroyed))
			.subscribe(result => {
				for (const query of Object.keys(result.breakpoints)) {
					if (result.breakpoints[query]) {
						if (query === Breakpoints.XSmall || query === Breakpoints.Small) {
							this.rows = '8';
							this.cols = '2';
						} else {
							this.rows = '5';
							this.cols = '1';
						}
					}
				}
			});
		this.myInfoForm.statusChanges.subscribe(result => {
			if (result === 'VALID') {
				this.formIsValid.emit(true);
			}
		});
	}

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
}
