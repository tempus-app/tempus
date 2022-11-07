import { Component, OnDestroy, OnInit } from '@angular/core';
import {
	OnboardingClientResourceService,
	OnboardingClientState,
	selectLoggedInUserId,
	selectLoggedInUserNameEmail,
} from '@tempus/client/onboarding-client/shared/data-access';
import { Subject, take, takeUntil } from 'rxjs';
import { ButtonType } from '@tempus/client/shared/ui-components/presentational';
import {
	ICreateExperienceDto,
	ICreateEducationDto,
	ICreateCertificationDto,
	ViewType,
	RevisionType,
} from '@tempus/shared-domain';
import {
	getAllViewsByResourceId,
	selectResourceViews,
	TempusResourceState,
} from '@tempus/client/onboarding-client/resource/data-access';
import { TranslateService } from '@ngx-translate/core';
import { sortViewsByLatestUpdated } from '@tempus/client/shared/util';
import { Store } from '@ngrx/store';

@Component({
	selector: 'tempus-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
	providers: [OnboardingClientResourceService],
})
export class ProfileComponent implements OnInit, OnDestroy {
	pageNum = 0;

	// make it very large so that it fetches all the views of the user
	pageSize = 1000;

	totalViews = 0;

	constructor(
		private resourceService: OnboardingClientResourceService,
		private translateService: TranslateService,
		private sharedStore: Store<OnboardingClientState>,
		private resourceStore: Store<TempusResourceState>,
	) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
	}

	dataLoaded = false;

	userId = 0;

	currentViewId = 0;

	firstName = '';

	lastName = '';

	fullName = '';

	experiencesSummary = '';

	educationsSummary = '';

	skillsSummary = '';

	profileSummary = '';

	workExperiences: Array<ICreateExperienceDto> = [];

	educations: Array<ICreateEducationDto> = [];

	certifications: Array<ICreateCertificationDto> = [];

	skills: Array<string> = [];

	destroyed$ = new Subject<void>();

	resume: File | null = null;

	profilePrefix = 'onboardingResourceProfile.';

	ButtonType = ButtonType;

	isPendingApproval = false;

	isRejected = false;

	rejectionComments = '';

	editViewEnabled = false;

	ngOnInit(): void {
		this.sharedStore
			.select(selectLoggedInUserId)
			.pipe(take(1))
			.subscribe(data => {
				if (data) {
					this.userId = data;
				}
			});
		this.sharedStore
			.select(selectLoggedInUserNameEmail)
			.pipe(take(1))
			.subscribe(data => {
				this.firstName = data.firstName || '';
				this.lastName = data.lastName || '';
			});

		// TODO: ADD resource to the store
		this.resourceService.getResourceOriginalResumeById(this.userId).subscribe(resumeBlob => {
			this.resume = new File([resumeBlob], 'original-resume.pdf');
		});

		this.resourceStore.dispatch(
			getAllViewsByResourceId({ resourceId: this.userId, pageSize: this.pageSize, pageNum: this.pageNum }),
		);

		// display latest primary view
		this.resourceStore
			.select(selectResourceViews)
			.pipe(takeUntil(this.destroyed$))
			.subscribe(data => {
				let filteredAndSortedViews = data?.views?.filter(view => view.viewType === ViewType.PRIMARY) || [];
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
				this.isRejected = latestView.revisionType === RevisionType.REJECTED;
				this.isPendingApproval = latestView.revisionType === RevisionType.PENDING;
				this.rejectionComments = latestView.revision?.comment ? latestView.revision.comment : '';

				this.dataLoaded = true;
			});
	}

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

	ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
