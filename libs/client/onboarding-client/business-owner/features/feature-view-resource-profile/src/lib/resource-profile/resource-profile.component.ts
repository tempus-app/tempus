import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
	OnboardingClientResourceService,
	OnboardingClientState,
} from '@tempus/client/onboarding-client/shared/data-access';
import { LoadView, ProjectResource } from '@tempus/shared-domain';
import { skip } from 'rxjs';
import {
	BusinessOwnerState,
	getOriginalResume,
	selectOriginalResume,
} from '@tempus/client/onboarding-client/business-owner/data-access';
import { EditViewFormComponent } from '@tempus/onboarding-client/shared/feature-edit-view-form';

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
		private businessOwnerStore: Store<BusinessOwnerState>,
	) {}

	@ViewChild(EditViewFormComponent) newViewForm!: EditViewFormComponent;

	viewFormEnabled = false;

	resourceId = 0;

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

	openNewViewForm() {
		this.viewFormEnabled = true;
	}

	ngOnInit(): void {
		this.resourceId = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
		this.resourceService.getResourceInformationById(this.resourceId).subscribe(resourceInfo => {
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

		this.sharedStore.dispatch(getOriginalResume({ resourceId: this.resourceId }));

		this.sharedStore
			.select(selectOriginalResume)
			.pipe(skip(1))
			.subscribe(blob => {
				if (blob) {
					this.resume = new File([blob], 'original-resume.pdf');
				}
			});
	}

	createNewView() {
		const newView = this.newViewForm.generateNewView();
		this.resourceService.createSecondaryView(this.resourceId, newView).subscribe();
		this.closeForm();
	}

	closeForm() {
		this.viewFormEnabled = false;
	}
}
