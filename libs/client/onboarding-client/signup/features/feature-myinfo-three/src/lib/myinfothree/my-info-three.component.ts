import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Country, State } from 'country-state-city';
import { Subject } from 'rxjs';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { InputType } from '@tempus/client/shared/ui-components/input';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
	createTrainingAndSkillDetails,
	selectResourceData,
	selectTrainingAndSkillsCreated,
	SignupState,
} from '@tempus/client/onboarding-client/signup/data-access';
import {
	CreateCertificationDto,
	CreateEducationDto,
	CreateLocationDto,
	CreateSkillDto,
	CreateSkillTypeDto,
} from '@tempus/shared-domain';

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

	createdTrainingAndSkills: boolean | undefined;

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
		skillsSummary: [''],
	});

	get qualifications() {
		// eslint-disable-next-line @typescript-eslint/dot-notation
		return this.myInfoForm.controls['qualifications'] as FormArray;
	}

	get certifications() {
		// eslint-disable-next-line @typescript-eslint/dot-notation
		return this.myInfoForm.controls['certifications'] as FormArray;
	}

	constructor(
		private route: ActivatedRoute,
		private fb: FormBuilder,
		breakpointObserver: BreakpointObserver,
		private router: Router,
		private store: Store<SignupState>,
	) {
		breakpointObserver
			.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
			.pipe(takeUntil(this.destroyed))
			.subscribe(result => {
				for (const query of Object.keys(result.breakpoints)) {
					if (result.breakpoints[query]) {
						if (query === Breakpoints.XSmall) {
							this.rows = '16';
							this.cols = '2';
							this.buttonSpacing = '3';
							this.certRows = '8';
							this.educationCols = '6';
							this.locationCols = '6';
						} else {
							this.rows = '8';
							this.cols = '1';
							this.buttonSpacing = '2';
							this.certRows = '6';
							this.educationCols = '3';
							this.locationCols = '2';
						}
					}
				}
			});
	}

	ngOnInit() {
		this.store
			.select(selectTrainingAndSkillsCreated)
			.pipe(
				take(1),
				tap(created => {
					this.createdTrainingAndSkills = created;
				}),
				filter(created => created),
				switchMap(_ => this.store.select(selectResourceData)),
				take(1),
			)
			.subscribe(createResourceDto => {
				// eslint-disable-next-line @typescript-eslint/dot-notation
				const educationsArray = this.qualifications;
				createResourceDto.educations.forEach(education => {
					educationsArray.push(
						this.fb.group({
							institution: [education.institution, Validators.required],
							field: [education.degree, Validators.required],
							country: [education.location.country],
							state: [education.location.province],
							city: [education.location.city],
							startDate: [education.startDate, Validators.required],
							endDate: [education.endDate, Validators.required],
						}),
					);
				});

				const certificationsArray = this.certifications;
				createResourceDto.certifications.forEach(certification => {
					certificationsArray.push(
						this.fb.group({
							certifyingAuthority: [certification.institution, Validators.required],
							title: [certification.title, Validators.required],
							summary: [''],
						}),
					);
				});

				createResourceDto.skills.forEach(skill => {
					this.skills.push(skill.skill.name);
				});

				this.myInfoForm.patchValue({
					educationSummary: createResourceDto.educationsSummary,
					skillsSummary: createResourceDto.skillsSummary,
				});
			});
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
		this.myInfoForm?.markAllAsTouched();
		if (this.myInfoForm?.valid) {
			this.store.dispatch(
				createTrainingAndSkillDetails({
					skillsSummary: this.myInfoForm.get('skillsSummary')?.value,
					educationsSummary: this.myInfoForm.get('educationSummary')?.value,
					educations: this.qualifications.value.map(qualification => {
						return {
							degree: qualification.degree?.value,
							institution: qualification.institution?.value,
							startDate: qualification.startDate?.value,
							endDate: qualification.endDate?.value,
							location: {
								country: qualification.country?.value,
								city: qualification.city?.value,
								province: qualification.state?.value,
							} as CreateLocationDto,
						} as CreateEducationDto;
					}),
					skills: this.skills.map(skill => {
						return {
							skill: {
								name: skill,
							} as CreateSkillTypeDto,
						} as CreateSkillDto;
					}),
					certifications: this.certifications.value.map(certification => {
						return {
							title: certification.title?.value,
							institution: certification.institution?.value,
						} as CreateCertificationDto;
					}),
				}),
			);
		}
		this.router.navigate(['../review'], { relativeTo: this.route });
	}

	backStep() {
		this.router.navigate(['../myinfotwo'], { relativeTo: this.route });
	}
}
