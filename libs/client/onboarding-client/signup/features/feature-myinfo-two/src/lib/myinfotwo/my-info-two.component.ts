import { Component, OnDestroy, OnInit } from '@angular/core';
import { Country, State } from 'country-state-city';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InputType } from '@tempus/client/shared/ui-components/input';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'tempus-my-info-two',
	templateUrl: './my-info-two.component.html',
	styleUrls: ['./my-info-two.component.scss'],
})
export class MyInfoTwoComponent implements OnDestroy, OnInit {
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

	myInfoForm = this.fb.group({
		workExperienceSummary: [''],
		workExperience: this.fb.array([]),
	});

	get totalWorkExperience() {
		return this.myInfoForm.controls.workExperience as FormArray;
	}

	constructor(private fb: FormBuilder, breakpointObserver: BreakpointObserver, private router: Router) {
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

	ngOnInit() {
		const workExperience = this.fb.group({
			title: ['', Validators.required],
			company: ['', Validators.required],
			country: ['', Validators.required],
			state: ['', Validators.required],
			city: ['', Validators.required],
			startDate: ['', Validators.required],
			endDate: ['', Validators.required],
			description: ['', Validators.required],
		});

		this.totalWorkExperience.push(workExperience);
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
		const workExperience = this.fb.group({
			title: ['', Validators.required],
			company: ['', Validators.required],
			country: ['', Validators.required],
			state: ['', Validators.required],
			city: ['', Validators.required],
			startDate: ['', Validators.required],
			endDate: ['', Validators.required],
			description: ['', Validators.required],
		});

		this.totalWorkExperience.push(workExperience);
	}

	removeWorkSection(index: number) {
		this.numberWorkSections.splice(index, 1);
		this.totalWorkExperience.removeAt(index);
	}

	updateStateOptions(inputtedCountry: string) {
		const countryCode = Country.getAllCountries().find(country => country.name === inputtedCountry);
		if (countryCode != null)
			this.states = State.getStatesOfCountry(countryCode.isoCode).map(state => {
				return state.name;
			});
	}

	nextStep() {
		this.router.navigateByUrl(`token/myinfothree`);
	}

	backStep() {
		this.router.navigateByUrl(`token/myinfoone`);
	}
}
