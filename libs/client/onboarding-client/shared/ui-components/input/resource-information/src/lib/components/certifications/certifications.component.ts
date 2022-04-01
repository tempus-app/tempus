import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
	}

	get certifications() {
		// eslint-disable-next-line @typescript-eslint/dot-notation
		return this.myInfoForm.controls['certifications'] as FormArray;
	}

	addCertificationSections() {
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
}
