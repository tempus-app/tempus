import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Country, State } from 'country-state-city';
import { InputType } from '@tempus/client/shared/ui-components/input';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICreateCertificationDto } from '@tempus/shared-domain';

@Component({
	selector: 'tempus-resource-info-certifications',
	templateUrl: './certifications.component.html',
	styleUrls: ['./certifications.component.scss'],
})
export class CertificationsComponent implements OnInit {
	InputType = InputType;

	numberCertificationSections: number[] = [0];

	countries: string[] = Country.getAllCountries().map(country => {
		return country.name;
	});

	states: string[] = State.getAllStates().map(state => {
		return state.name;
	});

	@Input() certificationsArray: Array<ICreateCertificationDto> = [];

	@Output() formGroup = new EventEmitter();

	@Output() formIsValid = new EventEmitter<boolean>();

	constructor(private fb: FormBuilder) {}

	myInfoForm = this.fb.group({
		certifications: this.fb.array([]),
	});

	certificationsPrefix = 'onboardingClient.input.certifications.';

	ngOnInit(): void {
		this.loadStoreData();
		this.formGroup.emit(this.myInfoForm);
	}

	loadStoreData() {
		this.myInfoForm.patchValue({
			certifications: this.certificationsArray,
		});

		// mock sections, add to FormArray, patch
		for (let i = 0; i < this.certificationsArray.length; i++) {
			const certification = this.fb.group({
				certifyingAuthority: ['', Validators.required],
				title: ['', Validators.required],
				summary: [''],
			});
			this.certifications.push(certification);

			// patch values
			(this.certifications.at(i) as FormGroup).get('title')?.patchValue(this.certificationsArray[i].title);
			(this.certifications.at(i) as FormGroup)
				.get('certifyingAuthority')
				?.patchValue(this.certificationsArray[i].institution);
			(this.certifications.at(i) as FormGroup).get('summary')?.patchValue(this.certificationsArray[i].summary);
		}
	}

	get certifications() {
		// eslint-disable-next-line @typescript-eslint/dot-notation
		return this.myInfoForm.controls['certifications'] as FormArray;
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
			summary: [''],
		});
		this.certifications.push(certification);
	}

	removeCertificationSection(index: number) {
		this.numberCertificationSections.splice(index, 1);
		this.certifications.removeAt(index);
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
