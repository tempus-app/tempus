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
import { ICreateExperienceDto, ICreateEducationDto, ICreateCertificationDto, View } from '@tempus/shared-domain';

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

	editEnabled = false;

	selectedTab(tab: string) {
		if (tab === 'logout') {
			this.logout();
		}
	}

	openEditView() {
		this.editEnabled = true;
		console.log('opening edit view');
		console.log(this.firstName);
	}

	closeEditView() {
		this.editEnabled = false;
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

			this.resourceService.getPrimaryView(this.userId).subscribe(primaryView => {
				this.certifications = primaryView.certifications;
				this.educations = primaryView.educations;
				this.educationsSummary = primaryView.educationsSummary;
				this.workExperiences = primaryView.experiences;
				this.experiencesSummary = primaryView.experiencesSummary;
				this.profileSummary = primaryView.profileSummary;
				this.skills = primaryView.skills.map(skill => skill.skill.name);
				this.skillsSummary = primaryView.skillsSummary;
			});
		});
	}

	ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
