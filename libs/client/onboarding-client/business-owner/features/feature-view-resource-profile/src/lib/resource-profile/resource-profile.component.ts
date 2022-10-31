import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
	OnboardingClientResourceService,
	OnboardingClientState,
	selectLoggedInUserNameEmail,
} from '@tempus/client/onboarding-client/shared/data-access';
import { LoadView, ProjectResource } from '@tempus/shared-domain';
import { skip, take } from 'rxjs';
import { getOriginalResume, selectOriginalResume } from '@tempus/client/onboarding-client/business-owner/data-access';

@Component({
	selector: 'tempus-resource-profile',
	templateUrl: './resource-profile.component.html',
	styleUrls: ['./resource-profile.component.scss'],
})
export class ResourceProfileComponent implements OnInit {
	constructor(
		private route: ActivatedRoute,
		private resourceService: OnboardingClientResourceService,
		private sharedStore: Store<OnboardingClientState>,
	) {}

	resourceFirstName = '';

	resourceLastName = '';

	name = '';

	email = '';

	country = '';

	state = '';

	city = '';

	resourceEmail = '';

	phoneNumber = '';

	viewIndex = 0;

	resume: File | null = null;

	loadedView: LoadView = { isRevision: false };

	linkedInLink = '';

	githubLink = '';

	otherLink = '';

	projectResources: ProjectResource[] = [];

	childRevisionLoaded(loadedView: LoadView) {
		this.loadedView = loadedView;
	}

	newViewClickEvent(viewIndex: number) {
		this.viewIndex = viewIndex;
	}

	ngOnInit(): void {
		const id = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
		this.resourceService.getResourceInformationById(id).subscribe(resourceInfo => {
			this.resourceFirstName = resourceInfo.firstName;
			this.resourceLastName = resourceInfo.lastName;
			this.city = resourceInfo.location.city;
			this.state = resourceInfo.location.province;
			this.country = resourceInfo.location.country;
			this.phoneNumber = resourceInfo.phoneNumber;
			this.resourceEmail = resourceInfo.email;
			this.linkedInLink = resourceInfo.linkedInLink;
			this.githubLink = resourceInfo.githubLink;
			this.otherLink = resourceInfo.otherLink;
			this.projectResources = resourceInfo.projectResources;
		});
		this.sharedStore.dispatch(getOriginalResume({ resourceId: id }));

		this.sharedStore
			.select(selectLoggedInUserNameEmail)
			.pipe(take(1))
			.subscribe(data => {
				this.name = `${data.firstName} ${data.lastName}`;
				this.email = data.email || '';
			});

		this.sharedStore
			.select(selectOriginalResume)
			.pipe(skip(1))
			.subscribe(blob => {
				if (blob) {
					this.resume = new File([blob], 'original-resume.pdf');
				}
			});
	}
}
