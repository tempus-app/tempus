import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
	OnboardingClientState,
	logout,
	OnboardingClientResourceService,
} from '@tempus/client/onboarding-client/shared/data-access';
import { Subject, take } from 'rxjs';
import { ButtonType } from '@tempus/client/shared/ui-components/presentational';
import { UserType } from '@tempus/client/shared/ui-components/persistent';
import { ICreateExperienceDto, ICreateEducationDto, ICreateCertificationDto, ICreateViewDto, View, ViewType, RevisionType } from '@tempus/shared-domain';

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
		private changeDetector: ChangeDetectorRef,
		private route: ActivatedRoute,
	) {}

	userId = 0;

	approvedPrimaryViewId = 0;

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

	reviewPrefix = 'onboardingClientSignupReview.';

	ButtonType = ButtonType;

	UserType = UserType;

	isPendingApproval = false;

	editViewEnabled = false;

	selectedTab(tab: string) {
		if (tab === 'logout') {
			this.logout();
		}
	}

	openEditView() {
		this.editViewEnabled = true;
	}

	closeEditView() {
		this.editViewEnabled = false;
	}

	logout() {
		this.store.dispatch(logout());
		this.router.navigateByUrl('signin');
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

			//fetch latest primary view
			this.resourceService.getLatestPrimaryView(this.userId).subscribe(primaryView => {
				if (primaryView.revisionType === RevisionType.APPROVED){
					this.approvedPrimaryViewId = primaryView.id;
				}
					this.certifications = primaryView.certifications;
					this.educations = primaryView.educations;
					this.educationsSummary = primaryView.educationsSummary;
					this.workExperiences = primaryView.experiences;
					this.experiencesSummary = primaryView.experiencesSummary;
					this.profileSummary = primaryView.profileSummary;
					this.skills = primaryView.skills.map(skill => skill.skill.name);
					this.skillsSummary = primaryView.skillsSummary;
				}
			)

			//fetch all Primary views, select PENDING to display if available
			// this.resourceService.getResourceProfileViews(this.userId).subscribe(views => {
			// 	const primaryViews =  views.filter(view => view.viewType === ViewType.PRIMARY);
			// 	const pendingView = primaryViews.find(view => view.revisionType === RevisionType.PENDING);
			// 	const approvedView = primaryViews.find(view => view.revisionType === RevisionType.APPROVED);

			// 	this.approvedPrimaryViewId = approvedView?.id ? approvedView.id : 0;

			// 	if (pendingView) {
			// 		this.certifications = pendingView.certifications;
			// 		this.educations = pendingView.educations;
			// 		this.educationsSummary = pendingView.educationsSummary;
			// 		this.workExperiences = pendingView.experiences;
			// 		this.experiencesSummary = pendingView.experiencesSummary;
			// 		this.profileSummary = pendingView.profileSummary;
			// 		this.skills = pendingView.skills.map(skill => skill.skill.name);
			// 		this.skillsSummary = pendingView.skillsSummary;
			// 		this.isPendingApproval = true;
			// 	} else if (approvedView) {
			// 		this.certifications = approvedView.certifications;
			// 		this.educations = approvedView.educations;
			// 		this.educationsSummary = approvedView.educationsSummary;
			// 		this.workExperiences = approvedView.experiences;
			// 		this.experiencesSummary = approvedView.experiencesSummary;
			// 		this.profileSummary = approvedView.profileSummary;
			// 		this.skills = approvedView.skills.map(skill => skill.skill.name);
			// 		this.skillsSummary = approvedView.skillsSummary;
			// 	}
			// })
		});
	}

	loadNewView(newView: ICreateViewDto) {
		//Update local display
		this.certifications = newView.certifications;
		this.educations = newView.educations;
		this.educationsSummary = newView.educationsSummary;
		this.workExperiences = newView.experiences;
		this.experiencesSummary = newView.experiencesSummary;
		this.profileSummary = newView.profileSummary;
		this.skills = newView.skills.map(skill => skill.skill.name);
		this.skillsSummary = newView.skillsSummary;

		this.isPendingApproval = true;

		//Post view to db, return revision
		this.resourceService.editResourceView(this.approvedPrimaryViewId, newView).subscribe(newRev => {
			console.log(newRev);
		});
	}

	ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
