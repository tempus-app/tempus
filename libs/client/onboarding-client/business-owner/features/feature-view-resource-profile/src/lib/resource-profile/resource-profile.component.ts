import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OnboardingClientResourceService } from '@tempus/client/onboarding-client/shared/data-access';
import { UserType } from '@tempus/client/shared/ui-components/persistent';
import { LoadView } from '@tempus/shared-domain';

@Component({
	selector: 'tempus-resource-profile',
	templateUrl: './resource-profile.component.html',
	styleUrls: ['./resource-profile.component.scss'],
})
export class ResourceProfileComponent implements OnInit {
	constructor(private route: ActivatedRoute, private resourceService: OnboardingClientResourceService) {}

	userType = UserType;

	firstName = '';

	lastName = '';

	country = '';

	state = '';

	city = '';

	email = '';

	phoneNumber = '';

	viewIndex = 0;

	loadedView: LoadView = { isRevision: false };

	childRevisionLoaded(loadedView: LoadView) {
		this.loadedView = loadedView;
	}

	newViewClickEvent(viewIndex: number) {
		this.viewIndex = viewIndex;
	}

	displayName() {
		return `${this.firstName} ${this.lastName}`;
	}

	ngOnInit(): void {
		const id = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
		this.resourceService.getResourceInformationById(id).subscribe(resourceInfo => {
			this.firstName = resourceInfo.firstName;
			this.lastName = resourceInfo.lastName;
			this.city = resourceInfo.location.city;
			this.state = resourceInfo.location.province;
			this.country = resourceInfo.location.country;
			this.phoneNumber = resourceInfo.phoneNumber;
			this.email = resourceInfo.email;
		});
	}
}
