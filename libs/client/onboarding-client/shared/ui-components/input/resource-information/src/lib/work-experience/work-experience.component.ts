import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Country, State } from 'country-state-city';
import { InputType } from '@tempus/client/shared/ui-components/input';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { checkEnteredDates } from '@tempus/shared/util';

@Component({
	selector: 'tempus-resource-info-work-experience',
	templateUrl: './work-experience.component.html',
	styleUrls: ['./work-experience.component.scss'],
})
export class WorkExperienceComponent implements OnInit {
	numberWorkSections: number[] = [0];

	InputType = InputType;

	@Output() formGroup = new EventEmitter();

	@Output() formIsValid = new EventEmitter<boolean>();

	constructor(private fb: FormBuilder) {}

	ngOnInit(): void {
		this.formGroup.emit(this.myInfoForm);
	}

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
		// eslint-disable-next-line @typescript-eslint/dot-notation
		return this.myInfoForm.controls['workExperience'] as FormArray;
	}

	addWorkSections() {
		// Prevent duplicate numbers which can cause an error when splicing a work experience section out
		if (this.numberWorkSections.length === 0) {
			this.numberWorkSections.push(0);
		} else {
			const lastElement = this.numberWorkSections[this.numberWorkSections.length - 1];
			this.numberWorkSections.push(lastElement + 1);
		}
		const workExperience = this.fb.group(
			{
				title: ['', Validators.required],
				company: ['', Validators.required],
				country: ['', Validators.required],
				state: ['', Validators.required],
				city: ['', Validators.required],
				startDate: ['', Validators.required],
				endDate: ['', Validators.required],
				description: ['', Validators.required],
			},
			{ validators: checkEnteredDates() },
		);

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
}
