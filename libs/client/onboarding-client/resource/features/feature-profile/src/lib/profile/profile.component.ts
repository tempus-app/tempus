import { Component, OnDestroy, OnInit } from '@angular/core';
import { OnboardingClientResourceService } from '@tempus/client/onboarding-client/shared/data-access';
import { Subject, take } from 'rxjs';
import { ButtonType } from '@tempus/client/shared/ui-components/presentational';
import {
	ICreateExperienceDto,
	ICreateEducationDto,
	ICreateCertificationDto,
	ViewType,
	RevisionType,
	View,
} from '@tempus/shared-domain';
import { TranslateService } from '@ngx-translate/core';
import { sortViewsByLatestUpdated } from '@tempus/client/shared/util';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'tempus-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
	providers: [OnboardingClientResourceService],
})
export class ProfileComponent implements OnInit, OnDestroy {
	constructor(
		private resourceService: OnboardingClientResourceService,
		private translateService: TranslateService,
		private router: Router,
		private route: ActivatedRoute,
	) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
	}

	dataLoaded = false;

	userId = 0;

	currentViewId = 0;

	pageTitle = '';

	viewName = '';

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

	profilePrefix = 'onboardingResourceProfile.';

	ButtonType = ButtonType;

	isPendingApproval = false;

	isRejected = false;

	rejectionComments = '';

	editViewEnabled = false;

	ngOnInit(): void {
		this.resourceService.getResourceInformation().subscribe(resData => {
			this.userId = resData.id;
			this.fullName = `${resData.firstName} ${resData.lastName}`;

			// Use viewId from route
			const viewId = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
			if (viewId) {
				this.resourceService.getViewById(viewId).subscribe(view => {
					this.pageTitle = view.type;
					this.loadView(view);
					this.dataLoaded = true;
				});
			} else {
				// Display Primary view
				this.translateService
					.get('onboardingResourceProfile.myProfile')
					.pipe(take(1))
					.subscribe(data => {
						this.pageTitle = data;
					});

				this.resourceService.getResourceProfileViews(this.userId).subscribe(views => {
					let filteredAndSortedViews = views.filter(view => view.viewType === ViewType.PRIMARY);
					filteredAndSortedViews = sortViewsByLatestUpdated(filteredAndSortedViews);
					this.loadView(filteredAndSortedViews[0]);
					this.dataLoaded = true;
				});
			}
		});
	}

	loadView(view: View) {
		this.currentViewId = view.id;
		this.viewName = view.type;
		this.certifications = view.certifications;
		this.educations = view.educations;
		this.educationsSummary = view.educationsSummary;
		this.workExperiences = view.experiences;
		this.experiencesSummary = view.experiencesSummary;
		this.profileSummary = view.profileSummary;
		this.skills = view.skills.map(skill => skill.skill.name);
		this.skillsSummary = view.skillsSummary;
		this.isRejected = view.revisionType === RevisionType.REJECTED;
		this.isPendingApproval = view.revisionType === RevisionType.PENDING;
		this.rejectionComments = view.revision?.comment ? view.revision.comment : '';
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
			link.download = `${this.fullName}-${this.viewName}`;
			link.click();
		});
	}

	ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
