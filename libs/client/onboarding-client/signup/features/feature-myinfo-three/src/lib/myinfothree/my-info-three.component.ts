import { Component, OnDestroy, OnInit } from '@angular/core';
import { Country, State } from 'country-state-city';
import { Subject } from 'rxjs';
import { InputType } from '@tempus/client/shared/ui-components/input';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'tempus-my-info-three',
	templateUrl: './my-info-three.component.html',
	styleUrls: ['./my-info-three.component.scss'],
})
export class MyInfoThreeComponent implements OnDestroy, OnInit {
	destroyed = new Subject<void>();

	cols = '1';

	buttonSpacing = '2';

	certRows = '6';

	educationCols = '3';

	locationCols = '2';

	rows = '12';

	InputType = InputType;

	addOnBlur = true;

	readonly separatorKeysCodes = [ENTER, COMMA] as const;

	skills: string[] = [];

	numberEducationSections: number[] = [0];

	numberCertificationSections: number[] = [0];

	countries: string[] = Country.getAllCountries().map(country => {
		return country.name;
	});

	states: string[] = State.getAllStates().map(state => {
		return state.name;
	});

	myInfoForm = this.fb.group({
		educationSummary: [''],
		qualifications: this.fb.array([]),
		certifications: this.fb.array([]),
		skills: [this.skills],
	});

	get qualifications() {
		// eslint-disable-next-line @typescript-eslint/dot-notation
		return this.myInfoForm.controls['qualifications'] as FormArray;
	}

	get certifications() {
		// eslint-disable-next-line @typescript-eslint/dot-notation
		return this.myInfoForm.controls['certifications'] as FormArray;
	}

	constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router) {}

	ngOnInit() {
		const qualification = this.fb.group({
			institution: ['', Validators.required],
			field: ['', Validators.required],
			country: [''],
			state: [''],
			city: [''],
			startDate: ['', Validators.required],
			endDate: ['', Validators.required],
		});

		const certification = this.fb.group({
			certifyingAuthority: ['', Validators.required],
			title: ['', Validators.required],
			summary: [''],
		});

		this.qualifications.push(qualification);
		this.certifications.push(certification);
	}

	ngOnDestroy() {
		this.destroyed.next();
		this.destroyed.complete();
	}

	addEducationSections() {
		// Prevent duplicate numbers which can cause an error when splicing a work experience section out
		if (this.numberEducationSections.length === 0) {
			this.numberEducationSections.push(0);
		} else {
			const lastElement = this.numberEducationSections[this.numberEducationSections.length - 1];
			this.numberEducationSections.push(lastElement + 1);
		}

		const qualification = this.fb.group({
			institution: ['', Validators.required],
			field: ['', Validators.required],
			country: [''],
			state: [''],
			city: [''],
			startDate: ['', Validators.required],
			endDate: ['', Validators.required],
		});

		this.qualifications.push(qualification);
	}

	removeEducationSection(index: number) {
		if (this.numberEducationSections.length > 1) {
			this.numberEducationSections.splice(index, 1);
		}
		this.qualifications.removeAt(index);
	}

	addCertificationSections() {
		// Prevent duplicate numbers which can cause an error when splicing a work experience section out
		if (this.numberCertificationSections.length === 0) {
			this.numberCertificationSections.push(0);
		} else {
			const lastElement = this.numberCertificationSections[this.numberCertificationSections.length - 1];
			this.numberCertificationSections.push(lastElement + 1);
		}
		const certification = this.fb.group({
			certifyingAuthority: ['', Validators.required],
			title: ['', Validators.required],
			description: [''],
		});
		this.certifications.push(certification);
	}

	removeCertificationSection(index: number) {
		this.numberCertificationSections.splice(index, 1);
		this.certifications.removeAt(index);
	}

	addSkill(event: MatChipInputEvent): void {
		const value = (event.value || '').trim().substring(0, 50);

		if (value) {
			this.skills.push(value);
		}
		if (event.chipInput !== undefined) {
			event.chipInput.clear();
		}
	}

	removeSkill(skill: string): void {
		const index = this.skills.indexOf(skill);

		if (index >= 0) {
			this.skills.splice(index, 1);
		}
	}

	updateStateOptions(inputtedCountry: string) {
		const countryCode = Country.getAllCountries().find(country => country.name === inputtedCountry);
		if (countryCode != null)
			this.states = State.getStatesOfCountry(countryCode.isoCode).map(state => {
				return state.name;
			});
	}

	nextStep() {
		this.router.navigate(['../review'], { relativeTo: this.route });
	}

	backStep() {
		this.router.navigate(['../myinfotwo'], { relativeTo: this.route });
	}
}
