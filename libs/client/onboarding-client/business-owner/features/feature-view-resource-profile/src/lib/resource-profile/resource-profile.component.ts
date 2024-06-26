import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
	OnboardingClientResourceService,
	OnboardingClientState,
  selectLoggedInUserNameEmail,
} from '@tempus/client/onboarding-client/shared/data-access';
import { LoadView, ProjectResource, RoleType } from '@tempus/shared-domain';
import { skip, take } from 'rxjs';
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
		private router: Router,
		private changeDetector: ChangeDetectorRef,
		private resourceService: OnboardingClientResourceService,
		private sharedStore: Store<OnboardingClientState>,
		private businessOwnerStore: Store<BusinessOwnerState>,
	) {}

	@ViewChild(EditViewFormComponent, { static: false }) newViewForm!: EditViewFormComponent;

	@Input() editViewEnabled = false;

	resourceId = 0;

	resourceFirstName = '';

	resourceLastName = '';

	name = '';

	email = '';

	calEmail = '';

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

	isPrimaryView = false;

  roles: RoleType[] = [];

	childRevisionLoaded(loadedView: LoadView) {
		this.loadedView = loadedView;
	}

	newViewClickEvent(viewIndex: number) {
		this.viewIndex = viewIndex;
	}

	editViewClickEvent() {
		this.editViewEnabled = true;
		this.changeDetector.detectChanges();
		const viewId = parseInt(this.route.snapshot.queryParamMap.get('viewId') || '0', 10);
		if (viewId) {
			this.resourceService
				.getViewById(viewId)
				.pipe(take(1))
				.subscribe(view => {
					this.newViewForm.setFormDataFromView(view);
				});
		}
	}

	closeEditView() {
		this.editViewEnabled = false;
		this.changeDetector.detectChanges();
	}

	submitChanges() {
		const viewId = parseInt(this.route.snapshot.queryParamMap.get('viewId') || '0', 10);
		const newView = this.newViewForm.generateNewView();
		this.resourceService
			.editResourceView(viewId, newView)
			.pipe(take(1))
			.subscribe(view => {
				this.router.navigate([], { queryParams: { viewId: view.id } }).then(() => window.location.reload());
			});
		this.closeEditView();
	}

	ngOnInit(): void {
		this.resourceId = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
		this.resourceService.getResourceInformationById(this.resourceId).subscribe(resourceInfo => {
			this.resourceFirstName = resourceInfo.firstName;
			this.resourceLastName = resourceInfo.lastName;
			this.calEmail = resourceInfo.calEmail ? resourceInfo.calEmail : '';
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
		this.businessOwnerStore.dispatch(getOriginalResume({ resourceId: this.resourceId }));

		this.sharedStore
			.select(selectLoggedInUserNameEmail)
			.pipe(take(1))
			.subscribe(data => {
        this.roles = data.roles;
			});

		this.businessOwnerStore
			.select(selectOriginalResume)
			.pipe(skip(1))
			.subscribe(blob => {
				if (blob) {
					this.resume = new File([blob], 'original-resume.pdf');
				}
			});
	}
}
