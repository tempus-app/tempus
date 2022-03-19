import { Component, OnInit } from '@angular/core';
import { formatDateRange } from '@tempus/shared/util';
import {
	Experience,
	Education,
	ICreateExperienceDto,
	ICreateEducationDto,
	ICreateCertificationDto,
} from '@tempus/shared-domain';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, take, takeUntil, tap } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';

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
export class ReviewComponent implements OnInit {
	firstName = '';

	lastName = '';

	experiencesSummary = '';

	educationsSummary = '';

	skillsSummary = '';

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

	constructor(private router: Router, private route: ActivatedRoute, private store: Store<SignupState>) {}

	ngOnInit(): void {
		this.store
			.select(selectResourceData)
			.pipe(take(1))
			.subscribe(resData => {
				this.firstName = resData?.firstName;
				this.lastName = resData?.lastName;
				this.email = resData?.email;
				this.phoneNumber = resData?.phoneNumber;
				this.country = resData?.location?.country;
				this.state = resData?.location?.province;
				this.city = resData?.location?.city;
				this.linkedInLink = resData?.linkedInLink;
				this.githubLink = resData?.githubLink;
				this.otherLink = resData?.otherLink;
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

	formatAddress(country: string, state: string, city: string) {
		return city + ', ' + state + ', ' + country;
	}

	formatName(first: string, last: string) {
		return first + ' ' + last;
	}

	backStep() {
		this.router.navigate(['../myinfothree'], { relativeTo: this.route });
	}

	submit() {
		this.store.dispatch(createResource());
	}
}
