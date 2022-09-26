import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
	OnboardingClientState,
	OnboardingClientResourceService,
} from '@tempus/client/onboarding-client/shared/data-access';
import { Subject, take } from 'rxjs';
import { ButtonType } from '@tempus/client/shared/ui-components/presentational';
import { UserType } from '@tempus/client/shared/ui-components/persistent';
import {
	ICreateExperienceDto,
	ICreateEducationDto,
	ICreateCertificationDto,
	ICreateViewDto,
	ViewType,
	RevisionType,
} from '@tempus/shared-domain';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'tempus-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
	providers: [OnboardingClientResourceService],
})
export class ProfileComponent implements OnInit, OnDestroy {
	constructor(
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

	workExperiences: Array<ICreateExperienceDto> = [];

	educations: Array<ICreateEducationDto> = [];

	certifications: Array<ICreateCertificationDto> = [];

	skills: Array<string> = [];

	destroyed$ = new Subject<void>();

	loading = false;

	resume: File | null = null;

	profilePrefix = 'onboardingResourceProfile.';

	ButtonType = ButtonType;

	UserType = UserType;

	isPendingApproval = false;

	isRejected = false;

	rejectionComments = '';

	editViewEnabled = false;

	openEditView() {
		this.editViewEnabled = true;
	}

	closeEditView() {
		this.editViewEnabled = false;
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

			// fetch all Primary views, select display
			this.resourceService.getResourceProfileViews(this.userId).subscribe(views => {
				const sortAndFilterViews = views
					.filter(view => view.viewType === ViewType.PRIMARY)
					.sort((a, b) =>
						// eslint-disable-next-line no-nested-ternary
						a.lastUpdateDate && b.lastUpdateDate
							? new Date(a.lastUpdateDate).getTime() > new Date(b.lastUpdateDate).getTime()
								? -1
								: 1
							: a.createdAt.getTime() > b.createdAt.getTime()
							? -1
							: 1,
					);

				const latestView = sortAndFilterViews[0];
				const latestApprovedView = sortAndFilterViews.find(view => view.revisionType === RevisionType.APPROVED);

				this.currentViewId = latestView.id;
				this.certifications = latestView.certifications;
				this.educations = latestView.educations;
				this.educationsSummary = latestView.educationsSummary;
				this.workExperiences = latestView.experiences;
				this.experiencesSummary = latestView.experiencesSummary;
				this.profileSummary = latestView.profileSummary;
				this.skills = latestView.skills.map(skill => skill.skill.name);
				this.skillsSummary = latestView.skillsSummary;
				this.isRejected = latestView.revisionType === RevisionType.REJECTED;
				this.isPendingApproval = latestView.revisionType === RevisionType.PENDING;
				this.rejectionComments = latestApprovedView?.revision?.comment ? latestApprovedView.revision.comment : '';
			});
		});
	}

	loadNewView(newView: ICreateViewDto) {
		// Update local display
		this.certifications = newView.certifications;
		this.educations = newView.educations;
		this.educationsSummary = newView.educationsSummary;
		this.workExperiences = newView.experiences;
		this.experiencesSummary = newView.experiencesSummary;
		this.profileSummary = newView.profileSummary;
		this.skills = newView.skills.map(skill => skill.skill.name);
		this.skillsSummary = newView.skillsSummary;

		this.isPendingApproval = true;

		// Post view
		this.resourceService.editResourceView(this.currentViewId, newView).pipe(take(1)).subscribe();
	}

	ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
