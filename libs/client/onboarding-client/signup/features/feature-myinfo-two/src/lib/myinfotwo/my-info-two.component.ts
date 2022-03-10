import { Component, OnDestroy, OnInit } from '@angular/core';
import { Country, State } from 'country-state-city';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { InputType } from '@tempus/client/shared/ui-components/input';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
	createWorkExperienceDetails,
	selectResourceData,
	selectWorkExperienceDetailsCreated,
	SignupState,
} from '@tempus/client/onboarding-client/signup/data-access';
import { CreateExperienceDto, CreateLocationDto } from '@tempus/shared-domain';

@Component({
	selector: 'tempus-my-info-two',
	templateUrl: './my-info-two.component.html',
	styleUrls: ['./my-info-two.component.scss'],
})
export class MyInfoTwoComponent implements OnDestroy, OnInit {
	destroyed = new Subject<void>();

	createdWorkExperiences: boolean | undefined;

	rows = '10';

	workCols = '3';

	locationCols = '2';

	numberWorkSections: number[] = [0];

	InputType = InputType;

	countries: string[] = Country.getAllCountries().map(country => {
		return country.name;
	});

	states: string[] = State.getAllStates().map(state => {
		return state.name;
	});

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
						if (query === Breakpoints.XSmall || query === Breakpoints.Small) {
							this.rows = '16';
							this.workCols = '6';
							this.locationCols = '6';
						} else {
							this.rows = '11';
							this.workCols = '3';
							this.locationCols = '2';
						}
					}
				}
			});
	}

	ngOnInit() {
		this.store
			.select(selectWorkExperienceDetailsCreated)
			.pipe(
				take(1),
				tap(created => {
					this.createdWorkExperiences = created;
				}),
				filter(created => created),
				switchMap(_ => this.store.select(selectResourceData)),
				take(1),
			)
			.subscribe(createResourceDto => {
				// eslint-disable-next-line @typescript-eslint/dot-notation
				const workExperienceArray = this.totalWorkExperience;
				createResourceDto.experiences.forEach(experience => {
					workExperienceArray.push(
						this.fb.group({
							title: [experience.title, Validators.required],
							company: [experience.company, Validators.required],
							country: [experience.location.country, Validators.required],
							state: [experience.location.province, Validators.required],
							city: [experience.location.city, Validators.required],
							startDate: [experience.startDate, Validators.required],
							endDate: [experience.endDate, Validators.required],
							description: [experience.description, Validators.required],
						}),
					);
				});
				this.myInfoForm.patchValue({
					workExperienceSummary: createResourceDto.experiencesSummary,
				});
			});
	}

	ngOnDestroy() {
		this.destroyed.next();
		this.destroyed.complete();
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
		if (countryCode != null)
			this.states = State.getStatesOfCountry(countryCode.isoCode).map(state => {
				return state.name;
			});
	}

	nextStep() {
		this.myInfoForm?.markAllAsTouched();
		if (this.myInfoForm?.valid) {
			this.store.dispatch(
				createWorkExperienceDetails({
					experiencesSummary: this.myInfoForm.get('workExperienceSummary')?.value,
					experiences: this.totalWorkExperience.value.map(
						(workExperience: {
							title: { value: string };
							company: { value: string };
							country: { value: string };
							province: { value: string };
							city: { value: string };
							startDate: { value: Date };
							endDate: { value: Date };
							description: { value: string };
						}) => {
							return {
								title: workExperience.title?.value,
								company: workExperience.company?.value,
								location: {
									country: workExperience.country?.value,
									province: workExperience.province?.value,
									city: workExperience.city?.value,
								} as CreateLocationDto,
								startDate: workExperience.startDate?.value,
								endDate: workExperience.endDate?.value,
								summary: workExperience.description?.value,
								description: [workExperience.description?.value],
							} as CreateExperienceDto;
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
