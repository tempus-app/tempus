import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { filter, switchMap, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { checkEnteredDates } from '@tempus/client/shared/util';
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
export class MyInfoTwoComponent implements AfterViewInit {
	myInfoForm = this.fb.group({});

	experiencesSummary = '';

	workExperiences: Array<ICreateExperienceDto> = [];

	@Output() formIsValid = new EventEmitter<boolean>();

	get totalWorkExperience() {
		// eslint-disable-next-line @typescript-eslint/dot-notation
		return this.myInfoForm.controls['workExperience'] as FormArray;
	}

	constructor(
		private route: ActivatedRoute,
		private fb: FormBuilder,
		private router: Router,
		private store: Store<SignupState>,
		private changeDetector: ChangeDetectorRef,
	) {}

	ngAfterViewInit(): void {
		this.changeDetector.detectChanges();
	}

	loadFormGroup(eventData: FormGroup) {
		this.myInfoForm = eventData;
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
				this.experiencesSummary = createResourceDto.experiencesSummary;
				this.workExperiences = createResourceDto.experiences;
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
							{ validators: checkEnteredDates() },
						),
					);
				});
				this.myInfoForm.patchValue({
					workExperienceSummary: createResourceDto.experiencesSummary,
				});
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
