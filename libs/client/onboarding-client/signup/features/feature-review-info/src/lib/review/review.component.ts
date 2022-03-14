import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, take, takeUntil, tap } from 'rxjs';
import {
	Experience,
	Education,
	ICreateExperienceDto,
	ICreateEducationDto,
	ICreateCertificationDto,
} from '@tempus/shared-domain';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDateRange } from '@tempus/shared/util';
import {
	createResource,
	resetCreateResourceState,
	resetLinkState,
	selectResourceData,
	selectResourceStatus,
	SignupState,
} from '@tempus/client/onboarding-client/signup/data-access';
import { Store } from '@ngrx/store';
import { AsyncRequestState } from '@tempus/client/onboarding-client/shared/data-access';

@Component({
	selector: 'tempus-review',
	templateUrl: './review.component.html',
	styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit, OnDestroy {
	firstName = '';

	lastName = '';

	experiencesSummary = '';

	educationsSummary = '';

	skillsSummary = '';

	email = '';

	country = '';

	state = '';

	city = '';

	workExperiences: Array<ICreateExperienceDto> = [];

	educations: Array<ICreateEducationDto> = [];

	certifications: Array<ICreateCertificationDto> = [];

	skills: Array<string> = [];

	destroyed$ = new Subject<void>();

	cols = '1';

	skillsEducationCols = '1';

	skillsChipsCols = '2';

	hideElement = false;

	displayNameMap = new Map([
		[Breakpoints.XSmall, '1'],
		[Breakpoints.Small, 'Small'],
		[Breakpoints.Medium, 'Medium'],
		[Breakpoints.Large, 'Large'],
		[Breakpoints.XLarge, 'XLarge'],
	]);

	loading = false;

	constructor(
		breakpointObserver: BreakpointObserver,
		private router: Router,
		private route: ActivatedRoute,
		private store: Store<SignupState>,
	) {
		breakpointObserver
			.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
			.pipe(takeUntil(this.destroyed$))
			.subscribe(result => {
				for (const query of Object.keys(result.breakpoints)) {
					if (result.breakpoints[query]) {
						if (query === Breakpoints.XSmall || query === Breakpoints.Small) {
							this.cols = '2';
							this.skillsChipsCols = '1';
							this.skillsEducationCols = '3';
							this.hideElement = false;
						} else {
							this.cols = '1';
							this.skillsChipsCols = '2';
							this.skillsEducationCols = '1';
							this.hideElement = true;
						}
					}
				}
			});
	}

	ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	ngOnInit(): void {
		this.store
			.select(selectResourceData)
			.pipe(take(1))
			.subscribe(resData => {
				this.firstName = resData?.firstName;
				this.lastName = resData?.lastName;
				this.email = resData?.email;
				this.country = resData?.location?.country;
				this.state = resData?.location?.province;
				this.city = resData?.location?.city;
				this.skillsSummary = resData?.skillsSummary;
				this.educationsSummary = resData?.educationsSummary;
				this.experiencesSummary = resData?.experiencesSummary;
				this.skills = resData?.skills.map(skill => skill.skill.name);
				this.workExperiences = resData?.experiences;
				this.certifications = resData?.certifications;
				this.educations = resData?.educations;
			});
		this.store.select(selectResourceStatus).subscribe(reqStatusData => {
			if (reqStatusData.status === AsyncRequestState.LOADING) {
				this.loading = true;
			} else if (reqStatusData.status === AsyncRequestState.SUCCESS) {
				alert('Resource Created Succesffully');
				this.loading = false;
				this.store.dispatch(resetLinkState());
				this.store.dispatch(resetCreateResourceState());
				this.router.navigate(['../../../profile/signin'], { relativeTo: this.route });
			} else if (reqStatusData.status === AsyncRequestState.ERROR) {
				this.loading = false;
				alert('Error creating resource');
			} else {
				this.loading = false;
			}
		});
	}

	formatDate(startDate: Date, endDate: Date) {
		return formatDateRange(new Date(startDate), new Date(endDate));
	}

	backStep() {
		this.router.navigate(['../myinfothree'], { relativeTo: this.route });
	}

	submit() {
		this.store.dispatch(createResource());
	}
}
