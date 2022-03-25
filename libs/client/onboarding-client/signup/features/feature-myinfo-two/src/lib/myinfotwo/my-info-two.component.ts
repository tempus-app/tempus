import { Component, OnInit } from '@angular/core';
import { City, Country, State } from 'country-state-city';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { InputType } from '@tempus/client/shared/ui-components/input';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
	createWorkExperienceDetails,
	selectResourceData,
	selectWorkExperienceDetailsCreated,
	SignupState,
} from '@tempus/client/onboarding-client/signup/data-access';
import { ICreateExperienceDto, ICreateLocationDto } from '@tempus/shared-domain';

@Component({
	selector: 'tempus-my-info-two',
	templateUrl: './my-info-two.component.html',
	styleUrls: ['./my-info-two.component.scss'],
})
export class MyInfoTwoComponent implements OnInit {
	numberWorkSections: number[] = [0];

	InputType = InputType;

	countries: string[] = Country.getAllCountries().map(country => {
		return country.name;
	});

	states: string[] = [];

	cities: string[] = [];

	countryCode = '';

	stateCode = '';

	myInfoForm = this.fb.group({
		workExperienceSummary: [''],
		workExperience: this.fb.array([]),
	});

	get totalWorkExperience() {
		// eslint-disable-next-line @typescript-eslint/dot-notation
		return this.myInfoForm.controls['workExperience'] as FormArray;
	}

	constructor(
		private route: ActivatedRoute,
		private fb: FormBuilder,
		private router: Router,
		private store: Store<SignupState>,
	) {}

	ngOnInit() {
		this.store
			.select(selectWorkExperienceDetailsCreated)
			.pipe(
				take(1),
				filter(created => created),
				switchMap(_ => this.store.select(selectResourceData)),
				take(1),
			)
			.subscribe(createResourceDto => {
				// eslint-disable-next-line @typescript-eslint/dot-notation
				const workExperienceArray = this.totalWorkExperience;
				createResourceDto.experiences.forEach(experience => {
					workExperienceArray.push(
						this.fb.group(
							{
								title: [experience.title, Validators.required],
								company: [experience.company, Validators.required],
								country: [experience.location.country, Validators.required],
								state: [experience.location.province, Validators.required],
								city: [experience.location.city, Validators.required],
								startDate: [experience.startDate, Validators.required],
								endDate: [experience.endDate, Validators.required],
								description: [experience.description, Validators.required],
							},
							{ validators: this.checkCountryState() },
						),
					);
				});
				this.myInfoForm.patchValue({
					workExperienceSummary: createResourceDto.experiencesSummary,
				});
			});
	}

	addWorkSections() {
		// Prevent duplicate numbers which can cause an error when splicing a work experience section out
		if (this.numberWorkSections.length === 0) {
			this.numberWorkSections.push(0);
		} else {
			const lastElement = this.numberWorkSections[this.numberWorkSections.length - 1];
			this.numberWorkSections.push(lastElement + 1);
		}
		const workExperience = this.fb.group({
			title: ['', Validators.required],
			company: ['', Validators.required],
			country: ['', Validators.required],
			state: ['', Validators.required],
			city: ['', Validators.required],
			startDate: ['', Validators.required],
			endDate: ['', Validators.required],
			description: ['', Validators.required],
		});

		this.totalWorkExperience.push(workExperience);
	}

	removeWorkSection(index: number) {
		this.numberWorkSections.splice(index, 1);
		this.totalWorkExperience.removeAt(index);
	}

	updateStateOptions(inputtedCountry: string) {
		const countryCode = Country.getAllCountries().find(country => country.name === inputtedCountry);
		this.countryCode = countryCode?.isoCode || '';
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
				createWorkExperienceDetails({
					experiencesSummary: this.myInfoForm.get('workExperienceSummary')?.value,
					experiences: this.totalWorkExperience.value.map(
						(workExperience: {
							title: string;
							company: string;
							country: string;
							state: string;
							city: string;
							startDate: Date;
							endDate: Date;
							description: string; // Need to be fixed to be array of strings
						}) => {
							return {
								title: workExperience.title,
								company: workExperience.company,
								location: {
									country: workExperience.country,
									province: workExperience.state,
									city: workExperience.city,
								} as ICreateLocationDto,
								startDate: workExperience.startDate,
								endDate: workExperience.endDate,
								summary: workExperience.description,
								description: [workExperience.description],
							} as ICreateExperienceDto;
						},
					),
				}),
			);
			this.router.navigate(['../myinfothree'], { relativeTo: this.route });
		}
	}

	backStep() {
		this.router.navigate(['../myinfoone'], { relativeTo: this.route });
	}
}
