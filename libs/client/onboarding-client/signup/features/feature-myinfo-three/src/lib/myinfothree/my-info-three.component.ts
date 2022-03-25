import { Component, OnInit } from '@angular/core';
import { City, Country, State } from 'country-state-city';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { InputType } from '@tempus/client/shared/ui-components/input';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, Validators } from '@angular/forms';
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
	InputType = InputType;

	addOnBlur = true;

	readonly separatorKeysCodes = [ENTER, COMMA] as const;

	skills: string[] = [];

	numberEducationSections: number[] = [0];

	numberCertificationSections: number[] = [0];

	countries: string[] = Country.getAllCountries().map(country => {
		return country.name;
	});

	states: string[] = [];

	cities: string[] = [];

	countryCode = '';

	stateCode = '';

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
		private router: Router,
		private store: Store<SignupState>,
	) {}

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
					educationsArray.push(
						this.fb.group(
							{
								institution: [education.institution, Validators.required],
								field: [education.degree, Validators.required],
								country: [education.location.country],
								state: [education.location.province],
								city: [education.location.city],
								startDate: [education.startDate, Validators.required],
								endDate: [education.endDate, Validators.required],
							},
							{ validators: this.checkCountryState() },
						),
					);
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

				this.myInfoForm.patchValue({
					educationSummary: createResourceDto.educationsSummary,
					skillsSummary: createResourceDto.skillsSummary,
				});
			});
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
			summary: [''],
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

	updateCityOptions(inputtedState: string) {
		const stateCode = State.getAllStates().find(state => state.name === inputtedState);
		this.stateCode = stateCode?.isoCode || '';
		if (stateCode != null)
			this.cities = City.getCitiesOfState(this.countryCode, stateCode.isoCode).map(city => {
				return city.name;
			});
	}

	checkCountryState() {
		return (controls: AbstractControl) => {
			if (controls) {
				const formCountry = controls.get('country')?.value;
				const formState = controls.get('state')?.value;
				const countryCode = Country.getAllCountries().find(country => country.name === formCountry);
				if (countryCode === undefined) {
					return { stateError: true };
				}
				if (countryCode != null) {
					const states = State.getStatesOfCountry(countryCode?.isoCode).map(state => {
						return state.name;
					});
					if (!states.find(state => state === formState)) {
						return { stateError: true };
					}
				}
			}
			return null;
		};
	}

	nextStep() {
		this.myInfoForm?.markAllAsTouched();
		if (this.myInfoForm?.valid) {
			this.store.dispatch(
				createTrainingAndSkillDetails({
					skillsSummary: this.myInfoForm.get('skillsSummary')?.value,
					educationsSummary: this.myInfoForm.get('educationSummary')?.value,
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
