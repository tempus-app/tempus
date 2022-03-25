import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { filter, switchMap, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { checkEnteredDates } from '@tempus/shared/util';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
	createTrainingAndSkillDetails,
	selectResourceData,
	selectTrainingAndSkillsCreated,
	SignupState,
} from '@tempus/client/onboarding-client/signup/data-access';
import {
	ICreateCertificationDto,
	ICreateEducationDto,
	ICreateLocationDto,
	ICreateSkillDto,
	ICreateSkillTypeDto,
} from '@tempus/shared-domain';

@Component({
	selector: 'tempus-my-info-three',
	templateUrl: './my-info-three.component.html',
	styleUrls: ['./my-info-three.component.scss'],
})
export class MyInfoThreeComponent implements OnInit {
	certificationsForm = this.fb.group({});
	educationsForm = this.fb.group({});
	skillsForm = this.fb.group({});

	skills: string[] = [];

	@Output() formIsValid = new EventEmitter<boolean>();

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		private store: Store<SignupState>,
	) {}

	get qualifications() {
		// eslint-disable-next-line @typescript-eslint/dot-notation
		return this.educationsForm.controls['qualifications'] as FormArray;
	}

	get certifications() {
		// eslint-disable-next-line @typescript-eslint/dot-notation
		return this.certificationsForm.controls['certifications'] as FormArray;
	}

	ngOnInit() {
		this.store
			.select(selectTrainingAndSkillsCreated)
			.pipe(
				take(1),
				filter(created => created),
				switchMap(_ => this.store.select(selectResourceData)),
				take(1),
			)
			.subscribe(createResourceDto => {
				// eslint-disable-next-line @typescript-eslint/dot-notation
				const educationsArray = this.qualifications;
				createResourceDto.educations.forEach(education => {
					const educationForm = this.fb.group(
						{
							institution: [education.institution, Validators.required],
							field: [education.degree, Validators.required],
							country: [education.location.country],
							state: [education.location.province],
							city: [education.location.city],
							startDate: [education.startDate, Validators.required],
							endDate: [education.endDate, Validators.required],
						},
						{ validators: checkEnteredDates() },
					);
					educationsArray.push(educationForm);
				});

				const certificationsArray = this.certifications;
				createResourceDto.certifications.forEach(certification => {
					certificationsArray.push(
						this.fb.group({
							certifyingAuthority: [certification.institution, Validators.required],
							title: [certification.title, Validators.required],
							summary: [certification.summary],
						}),
					);
				});

				createResourceDto.skills.forEach(skill => {
					this.skills.push(skill.skill.name);
				});

				this.skillsForm.patchValue({
					skillsSummary: createResourceDto.skillsSummary,
				});

				this.educationsForm.patchValue({
					educationSummary: createResourceDto.educationsSummary,
				});
			});
	}

	loadSkillsGroup(eventData: FormGroup) {
		this.skillsForm = eventData;
	}

	loadCertificationsGroup(eventData: FormGroup) {
		this.certificationsForm = eventData;
	}

	loadEducationsGroup(eventData: FormGroup) {
		this.educationsForm = eventData;
	}

	loadSkills(eventData: string[]) {
		this.skills = eventData;
	}

	isValid() {
		return this.skillsForm?.valid && this.educationsForm?.valid && this.certificationsForm?.valid;
	}

	nextStep() {
		this.skillsForm?.markAllAsTouched();
		this.educationsForm?.markAllAsTouched();
		this.certificationsForm?.markAllAsTouched();
		if (this.isValid()) {
			this.store.dispatch(
				createTrainingAndSkillDetails({
					skillsSummary: this.skillsForm.get('skillsSummary')?.value,
					educationsSummary: this.educationsForm.get('educationSummary')?.value,
					educations: this.qualifications.value.map(
						(qualification: {
							field: string;
							institution: string;
							startDate: Date;
							endDate: Date;
							country: string;
							city: string;
							state: string;
						}) => {
							return {
								degree: qualification.field,
								institution: qualification.institution,
								startDate: qualification.startDate,
								endDate: qualification.endDate,
								location: {
									country: qualification.country,
									city: qualification.city,
									province: qualification.state,
								} as ICreateLocationDto,
							} as ICreateEducationDto;
						},
					),
					skills: this.skills.map(skill => {
						return {
							skill: {
								name: skill,
							} as ICreateSkillTypeDto,
						} as ICreateSkillDto;
					}),
					certifications: this.certifications.value.map(
						(certification: { title: string; certifyingAuthority: string; summary: string }) => {
							return {
								title: certification.title,
								institution: certification.certifyingAuthority,
								summary: certification.summary,
							} as ICreateCertificationDto;
						},
					),
				}),
			);
		}
		this.router.navigate(['../review'], { relativeTo: this.route });
	}

	backStep() {
		this.router.navigate(['../myinfotwo'], { relativeTo: this.route });
	}
}
