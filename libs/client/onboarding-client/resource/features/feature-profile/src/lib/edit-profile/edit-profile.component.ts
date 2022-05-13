import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { OnboardingClientResourceService } from '@tempus/client/onboarding-client/shared/data-access';
import { Subject, take } from 'rxjs';
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
import { TranslateService } from '@ngx-translate/core';
import { ModalService, CustomModalType, ModalType } from '@tempus/client/shared/ui-components/modal';

@Component({
	selector: 'tempus-edit-profile',
	templateUrl: './edit-profile.component.html',
	styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements AfterViewInit, OnDestroy {
	constructor(
		private fb: FormBuilder,
		public modalService: ModalService,
		private resourceService: OnboardingClientResourceService,
		private changeDetector: ChangeDetectorRef,
		private translateService: TranslateService,
	) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
	}

	personalInfoForm = this.fb.group({});

	experiencesForm = this.fb.group({});

	educationsForm = this.fb.group({});

	certificationsForm = this.fb.group({});

	skillsSummaryForm = this.fb.group({});

	newSkills: string[] = [];

	email = '';

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

	editProfilePrefix = 'onboardingResourceEditProfile.';

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

		this.resourceService.getResourceInformation().subscribe(resData => {
			this.email = resData.email;
		});
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

	openSubmitConfirmation() {
		this.translateService
			.get([`onboardingResourceEditProfile.modal.submitModal`])
			.pipe(take(1))
			.subscribe(data => {
				const dialogText = data[`onboardingResourceEditProfile.modal.submitModal`];
				this.modalService.open(
					{
						title: dialogText.title,
						closeText: dialogText.closeText,
						confirmText: dialogText.confirmText,
						message: dialogText.message,
						closable: true,
						id: 'submit',
						modalType: ModalType.WARNING,
					},
					CustomModalType.INFO,
				);
			});

		this.modalService.confirmEventSubject.subscribe(() => {
			this.submitClicked.emit(this.generateNewView());
			this.closeEditView();
			this.modalService.close();
			this.modalService.confirmEventSubject.unsubscribe();
		});
	}

	submitChanges() {
		this.educationsForm?.markAllAsTouched();
		this.personalInfoForm?.markAllAsTouched();
		this.experiencesForm?.markAllAsTouched();
		this.skillsSummaryForm?.markAllAsTouched();
		this.certificationsForm?.markAllAsTouched();

		const isValid =
			this.personalInfoForm?.valid &&
			this.educationsForm?.valid &&
			this.certificationsForm?.valid &&
			this.experiencesForm?.valid &&
			this.skillsSummaryForm?.value;

		if (isValid) {
			this.openSubmitConfirmation();
		}
	}
}
