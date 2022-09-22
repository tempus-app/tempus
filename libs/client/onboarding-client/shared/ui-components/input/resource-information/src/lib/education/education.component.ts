import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Country, State } from 'country-state-city';
import { InputType } from '@tempus/client/shared/ui-components/input';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { checkEnteredDates } from '@tempus/client/shared/util';
import { ICreateEducationDto } from '@tempus/shared-domain';

@Component({
	selector: 'tempus-resource-info-education',
	templateUrl: './education.component.html',
	styleUrls: ['./education.component.scss'],
})
export class EducationComponent implements OnInit {
	InputType = InputType;

	@Input() educationSummary = '';

	@Input() educations: Array<ICreateEducationDto> = [];

	@Output() formGroup = new EventEmitter();

	@Output() formIsValid = new EventEmitter<boolean>();

	numberEducationSections: number[] = [0];

	countries: string[] = Country.getAllCountries().map(country => {
		return country.name;
	});

	states: string[] = State.getAllStates().map(state => {
		return state.name;
	});

	myInfoForm = this.fb.group({
		educationSummary: [''],
		qualifications: this.fb.array([]),
	});

	educationsPrefix = 'onboardingClient.input.education.';

	commonPrefix = 'onboardingClient.input.common.';

	constructor(private fb: FormBuilder) {}

	ngOnInit(): void {
		this.loadStoreData();
		this.formGroup.emit(this.myInfoForm);
	}

	loadStoreData() {
		this.myInfoForm.patchValue({
			educationSummary: this.educationSummary,
		});

		// mock sections, add to FormArray, patch
		for (let i = 0; i < this.educations.length; i++) {
			const qualification = this.fb.group(
				{
					institution: ['!', Validators.required],
					field: ['', Validators.required],
					country: [''],
					state: [''],
					city: [''],
					startDate: ['', Validators.required],
					endDate: ['', Validators.required],
				},
				{ validators: checkEnteredDates() },
			);
			this.qualifications.push(qualification);

			// patch values
			(this.qualifications.at(i) as FormGroup).get('institution')?.patchValue(this.educations[i].institution);
			(this.qualifications.at(i) as FormGroup).get('field')?.patchValue(this.educations[i].degree);
			(this.qualifications.at(i) as FormGroup).get('country')?.patchValue(this.educations[i].location.country);
			(this.qualifications.at(i) as FormGroup).get('state')?.patchValue(this.educations[i].location.province);
			(this.qualifications.at(i) as FormGroup).get('city')?.patchValue(this.educations[i].location.city);
			(this.qualifications.at(i) as FormGroup).get('startDate')?.patchValue(this.educations[i].startDate);
			(this.qualifications.at(i) as FormGroup).get('endDate')?.patchValue(this.educations[i].endDate);
		}
	}

	get qualifications() {
		// eslint-disable-next-line @typescript-eslint/dot-notation
		return this.myInfoForm.controls['qualifications'] as FormArray;
	}

	setCheck(checked: boolean, numEdu: AbstractControl) {
		if (checked) {
			numEdu.patchValue({ endDate: null });
			numEdu.get('endDate')?.disable();
		} else {
			numEdu.patchValue({ endDate: '' });
			numEdu.get('endDate')?.enable();
		}
	}

	addEducationSections() {
		// Prevent duplicate numbers which can cause an error when splicing a work experience section out
		if (this.numberEducationSections.length === 0) {
			this.numberEducationSections.push(0);
		} else {
			const lastElement = this.numberEducationSections[this.numberEducationSections.length - 1];
			this.numberEducationSections.push(lastElement + 1);
		}

		const qualification = this.fb.group(
			{
				institution: ['', Validators.required],
				field: ['', Validators.required],
				country: [''],
				state: [''],
				city: [''],
				startDate: ['', Validators.required],
				endDate: ['', Validators.required],
			},
			{ validators: checkEnteredDates() },
		);

		this.qualifications.push(qualification);
	}

	removeEducationSection(index: number) {
		if (this.numberEducationSections.length > 1) {
			this.numberEducationSections.splice(index, 1);
		}
		this.qualifications.removeAt(index);
	}

	updateStateOptions(inputtedCountry: string) {
		if (inputtedCountry === '') {
			this.states = [];
		}
		const countryCode = Country.getAllCountries().find(country => country.name === inputtedCountry);
		if (countryCode != null)
			this.states = State.getStatesOfCountry(countryCode.isoCode).map(state => {
				return state.name;
			});
	}
}
