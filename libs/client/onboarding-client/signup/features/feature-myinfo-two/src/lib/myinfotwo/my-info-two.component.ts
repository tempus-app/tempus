import { Component, OnDestroy } from '@angular/core';
import { Country, State } from 'country-state-city';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InputType } from '@tempus/client/shared/ui-components/input';

@Component({
	selector: 'tempus-my-info-two',
	templateUrl: './my-info-two.component.html',
	styleUrls: ['./my-info-two.component.scss'],
})
export class MyInfoTwoComponent implements OnDestroy {
	destroyed = new Subject<void>();

	rows = '10';

	workCols = '3';

	locationCols = '2';

	numberWorkSections: number[] = [0];

	InputType = InputType;

	countries: string[] = Country.getAllCountries().map(country => {
		return country.name;
	});

	states: string[] = State.getAllStates().map(state => {
		return state.name;
	});

	constructor(breakpointObserver: BreakpointObserver) {
		breakpointObserver
			.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
			.pipe(takeUntil(this.destroyed))
			.subscribe(result => {
				for (const query of Object.keys(result.breakpoints)) {
					if (result.breakpoints[query]) {
						if (query === Breakpoints.XSmall || query === Breakpoints.Small) {
							this.rows = '16';
							this.workCols = '6';
							this.locationCols = '6';
						} else {
							this.rows = '11';
							this.workCols = '3';
							this.locationCols = '2';
						}
					}
				}
			});
	}

	ngOnDestroy() {
		this.destroyed.next();
		this.destroyed.complete();
	}

	addWorkSections() {
		// Prevent duplicate numbers which can cause an error when splicing a work experience section out
		if (this.numberWorkSections.length === 0) {
			this.numberWorkSections.push(0);
		} else {
			const lastElement = this.numberWorkSections[this.numberWorkSections.length - 1];
			this.numberWorkSections.push(lastElement + 1);
		}
	}

	removeWorkSection(index: number) {
		this.numberWorkSections.splice(index, 1);
	}

	updateStateOptions(inputtedCountry: string) {
		const countryCode = Country.getAllCountries().find(country => country.name === inputtedCountry);
		if (countryCode != null)
			this.states = State.getStatesOfCountry(countryCode.isoCode).map(state => {
				return state.name;
			});
	}
}
