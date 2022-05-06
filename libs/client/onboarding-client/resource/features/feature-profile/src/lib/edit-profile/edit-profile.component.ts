import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
	OnboardingClientResourceService,
	OnboardingClientState,
} from '@tempus/client/onboarding-client/shared/data-access';
import { Subject } from 'rxjs';
import { ButtonType } from '@tempus/client/shared/ui-components/presentational';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
	ICreateCertificationDto,
	ICreateEducationDto,
	ICreateExperienceDto,
	ICreateViewDto,
	ICreateLocationDto,
	ViewType,
	ICreateSkillDto,
	ICreateSkillTypeDto,
} from '@tempus/shared-domain';

@Component({
	selector: 'tempus-edit-profile',
	templateUrl: './edit-profile.component.html',
	styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements AfterViewInit, OnDestroy {
	constructor(
		private fb: FormBuilder,
		private resourceService: OnboardingClientResourceService,
		private changeDetector: ChangeDetectorRef,
	) {}

	personalInfoForm = this.fb.group({});

	experiencesForm = this.fb.group({});

	educationsForm = this.fb.group({});

	certificationsForm = this.fb.group({});

	skillsSummaryForm = this.fb.group({});

	newSkills: string[] = [];

	isValid = true;

	previewViewEnabled = false;

	@Input() firstName = '';

	@Input() lastName = '';

	@Input() phoneNumber = '';

	@Input() linkedInLink = '';

	@Input() githubLink = '';

	@Input() otherLink = '';

	@Input() country = '';

	@Input() state = '';

	@Input() city = '';

	@Input() profileSummary = '';

	@Input() educationsSummary = '';

	@Input() educations: Array<ICreateEducationDto> = [];

	@Input() experiencesSummary = '';

	@Input() workExperiences: Array<ICreateExperienceDto> = [];

	@Input() certifications: Array<ICreateCertificationDto> = [];

	@Input() skillsSummary = '';

	@Input() skills: string[] = [];

	destroyed$ = new Subject<void>();

	ButtonType = ButtonType;

	@Output()
	openEditView = new EventEmitter();

	@Output()
	closeEditViewClicked = new EventEmitter();

	@Output()
	submitClicked = new EventEmitter();

	ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	closeEditView() {
		this.closeEditViewClicked.emit('close');
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

	ngAfterViewInit(): void {
		this.changeDetector.detectChanges();
	}

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

	submitChanges() {
		this.educationsForm?.markAllAsTouched();
		this.personalInfoForm?.markAllAsTouched();
		this.experiencesForm?.markAllAsTouched();
		this.skillsSummaryForm?.markAllAsTouched();
		this.certificationsForm?.markAllAsTouched();

		// TODO: disable submit button
		// TODO: disable non view related fields (i.e name, address etc)
		// should be extracted from personal-info component?
		// this.isValid = this.personalInfoForm?.valid && this.personalInfoForm?.valid && this.certificationsForm?.valid && this.experiencesForm?.valid
		// && this.skillsSummaryForm?.valid;

		if (this.isValid) {
			this.submitClicked.emit(this.generateNewView());
			this.closeEditView();
		}
	}
}
