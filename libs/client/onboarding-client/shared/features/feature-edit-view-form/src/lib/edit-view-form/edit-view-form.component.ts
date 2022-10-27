import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
	OnboardingClientState,
	OnboardingClientResourceService,
	selectAccessToken,
} from '@tempus/client/onboarding-client/shared/data-access';
import { Subject, takeUntil } from 'rxjs';
import { ButtonType } from '@tempus/client/shared/ui-components/presentational';
import { UserType } from '@tempus/client/shared/ui-components/persistent';
import {
	ICreateExperienceDto,
	ICreateEducationDto,
	ICreateCertificationDto,
	ViewType,
	ICreateViewDto,
	ICreateSkillDto,
	ICreateLocationDto,
	ICreateSkillTypeDto,
	RevisionType,
	RoleType,
	View,
} from '@tempus/shared-domain';
import { TranslateService } from '@ngx-translate/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { decodeJwt, sortViewsByLatestUpdated } from '@tempus/client/shared/util';

@Component({
	selector: 'tempus-edit-view-form',
	templateUrl: './edit-view-form.component.html',
	styleUrls: ['./edit-view-form.component.scss'],
	providers: [OnboardingClientResourceService],
})
export class EditViewFormComponent implements OnInit, OnDestroy {
	constructor(
		private fb: FormBuilder,
		private resourceService: OnboardingClientResourceService,
		private store: Store<OnboardingClientState>,
		private router: Router,
		private route: ActivatedRoute,
		private translateService: TranslateService,
	) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
	}

	@Input() isPrimaryView = true;

	@Output()
	closeEditViewClicked = new EventEmitter();

	@Output()
	submitClicked = new EventEmitter();

	dataLoaded = false;

	roles: string[] = [];

	userId = 0;

	currentViewId = 0;

	viewName = new FormControl('View Name', Validators.required);

	experiencesSummary = '';

	educationsSummary = '';

	skillsSummary = '';

	profileSummary = '';

	testLinked = '';

	workExperiences: Array<ICreateExperienceDto> = [];

	educations: Array<ICreateEducationDto> = [];

	certifications: Array<ICreateCertificationDto> = [];

	skills: Array<string> = [];

	destroyed$ = new Subject<void>();

	personalInfoForm = this.fb.group({ profileSummary: '' });

	educationsForm = this.fb.group({});

	certificationsForm = this.fb.group({});

	experiencesForm = this.fb.group({});

	skillsSummaryForm = this.fb.group({});

	resume: File | null = null;

	ButtonType = ButtonType;

	UserType = UserType;

	editViewFormPrefix = 'onboardingClient.editViewForm.';

	previewViewEnabled = false;

	ngOnInit(): void {
		this.store
			.select(selectAccessToken)
			.pipe(takeUntil(this.destroyed$))
			.subscribe(token => {
				this.roles = decodeJwt(token || '').roles;
			});

		// Business Owner
		if (this.roles.includes(RoleType.BUSINESS_OWNER) || this.roles.includes(RoleType.SUPERVISOR)) {
			const id = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);

			this.resourceService.getResourceOriginalResumeById(id).subscribe(resumeBlob => {
				this.resume = new File([resumeBlob], 'original-resume.pdf');
			});

			// Load form with approved Primary view
			this.resourceService.getResourceProfileViews(id).subscribe(profileViews => {
				const filteredViews = profileViews.filter(
					view => view.viewType === ViewType.PRIMARY && view.revisionType === RevisionType.APPROVED,
				);
				this.setFormDataFromView(filteredViews[0]);
				this.dataLoaded = true;
			});
		} else {
			// Resource
			this.resourceService.getResourceInformation().subscribe(resData => {
				this.userId = resData.id;

				// TODO: ADD resource to the store
				this.resourceService.getResourceOriginalResumeById(this.userId).subscribe(resumeBlob => {
					this.resume = new File([resumeBlob], 'original-resume.pdf');
				});

				// TODO: to edit secondary views, get latest version of that view through its revision
				this.resourceService.getResourceProfileViews(this.userId).subscribe(views => {
					let filteredAndSortedViews = this.isPrimaryView
						? views.filter(view => view.viewType === ViewType.PRIMARY)
						: views.filter(view => view.viewType === ViewType.PRIMARY && view.revisionType === RevisionType.APPROVED);

					filteredAndSortedViews = sortViewsByLatestUpdated(filteredAndSortedViews);
					this.setFormDataFromView(filteredAndSortedViews[0]);
					this.dataLoaded = true;
				});
			});
		}
	}

	setFormDataFromView(view: View) {
		this.currentViewId = view.id;
		this.certifications = view.certifications;
		this.educations = view.educations;
		this.educationsSummary = view.educationsSummary;
		this.workExperiences = view.experiences;
		this.experiencesSummary = view.experiencesSummary;
		this.profileSummary = view.profileSummary;
		this.skills = view.skills.map(skill => skill.skill.name);
		this.skillsSummary = view.skillsSummary;

		this.personalInfoForm.patchValue({
			profileSummary: this.profileSummary,
		});
	}

	loadExperiences(eventData: FormGroup) {
		this.experiencesForm = eventData;
	}

	loadEducation(eventData: FormGroup) {
		this.educationsForm = eventData;
	}

	loadCertifications(eventData: FormGroup) {
		this.certificationsForm = eventData;
	}

	loadSkillsSummary(eventData: FormGroup) {
		this.skillsSummaryForm = eventData;
	}

	loadSkills(eventData: string[]) {
		this.skills = eventData;
	}

	togglePreview() {
		this.previewViewEnabled = !this.previewViewEnabled;

		// display form values
		const editedForms = this.generateNewView();

		this.profileSummary = editedForms.profileSummary;
		this.educationsSummary = editedForms.educationsSummary;
		this.experiencesSummary = editedForms.experiencesSummary;
		this.workExperiences = editedForms.experiences;
		this.educations = editedForms.educations;
		this.certifications = editedForms.certifications;
		this.skillsSummary = editedForms.skillsSummary;
		this.skills = editedForms.skills.map(skill => skill.skill.name);
	}

	/** *
	 * returns a ICreateViewDto of the edited view
	 */
	generateNewView() {
		// get all nested FormGroups -> Dto[]
		const viewName = this.viewName.value;
		const certificationsArray = this.certificationsForm.controls.certifications as FormArray;
		const experiencesArray = this.experiencesForm.controls.workExperience as FormArray;
		const educationsArray = this.educationsForm.controls.qualifications as FormArray;

		const certificationsDto: ICreateCertificationDto[] = [];
		for (let i = 0; i < certificationsArray?.length; i++) {
			const certification: ICreateCertificationDto = {
				title: (certificationsArray?.at(i) as FormGroup).get('title')?.value,
				institution: (certificationsArray?.at(i) as FormGroup).get('certifyingAuthority')?.value,
				summary: (certificationsArray?.at(i) as FormGroup).get('summary')?.value,
			};
			certificationsDto.push(certification);
		}

		const experiencesDto: ICreateExperienceDto[] = [];
		for (let i = 0; i < experiencesArray?.length; i++) {
			const experience: ICreateExperienceDto = {
				title: (experiencesArray?.at(i) as FormGroup).get('title')?.value,
				summary: (experiencesArray?.at(i) as FormGroup).get('description')?.value,
				description: [(experiencesArray?.at(i) as FormGroup).get('description')?.value],
				startDate: (experiencesArray?.at(i) as FormGroup).get('startDate')?.value,
				endDate: (experiencesArray?.at(i) as FormGroup).get('endDate')?.value,
				company: (experiencesArray?.at(i) as FormGroup).get('company')?.value,
				location: {
					city: (experiencesArray?.at(i) as FormGroup).get('city')?.value,
					province: (experiencesArray?.at(i) as FormGroup).get('state')?.value,
					country: (experiencesArray?.at(i) as FormGroup).get('country')?.value,
				} as ICreateLocationDto,
			};
			experiencesDto.push(experience);
		}

		const educationsDto: ICreateEducationDto[] = [];
		for (let i = 0; i < educationsArray?.length; i++) {
			const education: ICreateEducationDto = {
				degree: (educationsArray?.at(i) as FormGroup).get('field')?.value,
				institution: (educationsArray?.at(i) as FormGroup).get('institution')?.value,
				location: {
					city: (educationsArray?.at(i) as FormGroup).get('city')?.value,
					province: (educationsArray?.at(i) as FormGroup).get('state')?.value,
					country: (educationsArray?.at(i) as FormGroup).get('country')?.value,
				} as ICreateLocationDto,
				startDate: (educationsArray?.at(i) as FormGroup).get('startDate')?.value,
				endDate: (educationsArray?.at(i) as FormGroup).get('endDate')?.value,
			};
			educationsDto.push(education);
		}

		// TODO: convert to use skills FormArray
		const skillsDto: ICreateSkillDto[] = [];
		for (let i = 0; i < this.skills?.length; i++) {
			const skill: ICreateSkillDto = {
				skill: {
					name: this.skills[i],
				} as ICreateSkillTypeDto,
			};
			skillsDto.push(skill);
		}

		return {
			skillsSummary: this.skillsSummaryForm.get('skillsSummary')?.value,
			experiencesSummary: this.experiencesForm.get('workExperienceSummary')?.value,
			educationsSummary: this.educationsForm.get('educationSummary')?.value,
			profileSummary: this.personalInfoForm.get('profileSummary')?.value,
			skills: skillsDto,
			educations: educationsDto,
			experiences: experiencesDto,
			certifications: certificationsDto,
			viewType: this.isPrimaryView ? ViewType.PRIMARY : ViewType.SECONDARY,
			type: this.isPrimaryView ? 'Primary' : viewName,
		} as ICreateViewDto;
	}

	isValid() {
		return (
			this.personalInfoForm?.valid &&
			this.educationsForm?.valid &&
			this.certificationsForm?.valid &&
			this.experiencesForm?.valid &&
			this.skillsSummaryForm?.valid &&
			this.viewName.valid
		);
	}

	validateForm() {
		this.educationsForm?.markAllAsTouched();
		this.personalInfoForm?.markAllAsTouched();
		this.experiencesForm?.markAllAsTouched();
		this.skillsSummaryForm?.markAllAsTouched();
		this.certificationsForm?.markAllAsTouched();
		this.viewName.markAllAsTouched();

		return this.isValid();
	}

	closeEditView() {
		this.closeEditViewClicked.emit();
	}

	submitChanges() {
		this.submitClicked.emit();
	}

	ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
