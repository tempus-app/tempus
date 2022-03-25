import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Country, State } from 'country-state-city';
import { InputType } from '@tempus/client/shared/ui-components/input';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
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

	ngOnInit(): void {
		this.loadStoreData();
		this.formGroup.emit(this.myInfoForm);
	}

	loadStoreData() {
		this.myInfoForm.patchValue({
			certifications: this.certificationsArray,
		});
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
		const countryCode = Country.getAllCountries().find(country => country.name === inputtedCountry);
		if (countryCode != null)
			this.states = State.getStatesOfCountry(countryCode.isoCode).map(state => {
				return state.name;
			});
	}
}
