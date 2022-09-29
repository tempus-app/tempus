import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormBuilder } from '@angular/forms';

@Component({
	selector: 'tempus-resource-info-skills',
	templateUrl: './skills.component.html',
	styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent implements OnInit {
	addOnBlur = true;

	readonly separatorKeysCodes = [ENTER, COMMA] as const;

	@Input() skillsSummary = '';

	@Input() skills: string[] = [];

	@Output() formGroup = new EventEmitter();

	@Output() emitSkills = new EventEmitter();

	@Output() formIsValid = new EventEmitter<boolean>();

	myInfoForm = this.fb.group({
		skills: [this.skills],
		skillsSummary: [''],
	});

	skillsPrefix = 'onboardingClient.input.skills.';

	constructor(private fb: FormBuilder) {}

	ngOnInit(): void {
		this.loadStoreData();
		this.formGroup.emit(this.myInfoForm);
		this.emitSkills.emit(this.skills);
	}

	loadStoreData() {
		this.myInfoForm.patchValue({
			skillsSummary: this.skillsSummary,
			skills: this.skills,
		});
	}

	addSkill(event: MatChipInputEvent): void {
		const value = (event.value || '').trim().substring(0, 50);
		if (value) {
			if (this.skills.includes(value)) {
				// eslint-disable-next-line @typescript-eslint/dot-notation
				this.myInfoForm.controls['skills'].setErrors({ incorrectValue: value });
			}
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

		const hasNoDuplicates = new Set(this.skills).size === this.skills.length;
		if (hasNoDuplicates) {
			// eslint-disable-next-line @typescript-eslint/dot-notation
			this.myInfoForm.controls['skills'].setErrors(null);
		}
	}
}
