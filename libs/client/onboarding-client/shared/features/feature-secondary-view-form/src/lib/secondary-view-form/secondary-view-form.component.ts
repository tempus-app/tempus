import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
	OnboardingClientState,
	OnboardingClientResourceService,
} from '@tempus/client/onboarding-client/shared/data-access';
import { Subject } from 'rxjs';
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
} from '@tempus/shared-domain';
import { TranslateService } from '@ngx-translate/core';
import { sortViewsByLatestUpdated } from '@tempus/client/shared/util';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
	selector: 'tempus-secondary-view-form',
	templateUrl: './secondary-view-form.component.html',
	styleUrls: ['./secondary-view-form.component.scss'],
	providers: [OnboardingClientResourceService],
})
export class SecondaryViewFormComponent implements OnInit, OnDestroy {
	constructor(
		private fb: FormBuilder,
		private resourceService: OnboardingClientResourceService,
		private store: Store<OnboardingClientState>,
		private router: Router,
		private translateService: TranslateService,
	) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
	}

	shown = false;

	userId = 0;

	currentViewId = 0;

	firstName = '';

	lastName = '';

	fullName = '';

	experiencesSummary = '';

	educationsSummary = '';

	skillsSummary = '';

	profileSummary = '';

	email = '';

	phoneNumber = '';

	country = '';

	state = '';

	city = '';

	linkedInLink = '';

	githubLink = '';

	otherLink = '';

	testLinked = '';

	workExperiences: Array<ICreateExperienceDto> = [];

	educations: Array<ICreateEducationDto> = [];

	certifications: Array<ICreateCertificationDto> = [];

	skills: Array<string> = [];

	destroyed$ = new Subject<void>();

	personalInfoForm = this.fb.group({});

	educationsForm = this.fb.group({});

	certificationsForm = this.fb.group({});

	experiencesForm = this.fb.group({});

	skillsSummaryForm = this.fb.group({});

	loading = false;

	resume: File | null = null;

	ButtonType = ButtonType;

	UserType = UserType;

	editProfilePrefix = 'onboardingResourceEditProfile.';

	previewViewEnabled = false;

	loadPersonalInfo(eventData: FormGroup) {
		this.personalInfoForm = eventData;
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

	generateNewView() {
		// get all nested FormGroups -> Dto[]
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
			viewType: ViewType.PRIMARY,
		} as ICreateViewDto;
	}

	downloadProfile() {
		// Taken from https://stackoverflow.com/questions/52154874/angular-6-downloading-file-from-rest-api
		this.resourceService.downloadProfile(this.currentViewId).subscribe(data => {
			const downloadURL = window.URL.createObjectURL(data);
			const link = document.createElement('a');
			link.href = downloadURL;
			// const index = this.viewIDs.indexOf(parseInt(this.currentViewID, 10));
			link.download = `${this.fullName}-Primary`;
			link.click();
		});
	}

	// loadPersonalInfo(eventData: FormGroup) {
	// 	this.personalInfoForm = eventData;
	// }

	ngOnInit(): void {
		this.resourceService.getResourceInformation().subscribe(resData => {
			this.userId = resData.id;
			this.firstName = resData.firstName;
			this.lastName = resData.lastName;
			this.fullName = `${resData.firstName} ${resData.lastName}`;
			this.city = resData.location.city;
			this.state = resData.location.province;
			this.country = resData.location.country;
			this.phoneNumber = resData.phoneNumber;
			this.email = resData.email;
			this.phoneNumber = resData.phoneNumber;
			this.linkedInLink = resData.linkedInLink;
			this.githubLink = resData.githubLink;
			this.otherLink = resData.otherLink;

			// TODO: ADD resource to the store
			this.resourceService.getResourceOriginalResumeById(this.userId).subscribe(resumeBlob => {
				this.resume = new File([resumeBlob], 'original-resume.pdf');
			});
			// display latest primary view
			this.resourceService.getResourceProfileViews(this.userId).subscribe(views => {
				let filteredAndSortedViews = views.filter(view => view.viewType === ViewType.PRIMARY);
				filteredAndSortedViews = sortViewsByLatestUpdated(filteredAndSortedViews);
				const latestView = filteredAndSortedViews[0];
				this.currentViewId = latestView.id;
				this.certifications = latestView.certifications;
				this.educations = latestView.educations;
				this.educationsSummary = latestView.educationsSummary;
				this.workExperiences = latestView.experiences;
				this.experiencesSummary = latestView.experiencesSummary;
				this.profileSummary = latestView.profileSummary;
				this.skills = latestView.skills.map(skill => skill.skill.name);
				this.skillsSummary = latestView.skillsSummary;

				this.shown = true;
			});
		});
	}

	ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
