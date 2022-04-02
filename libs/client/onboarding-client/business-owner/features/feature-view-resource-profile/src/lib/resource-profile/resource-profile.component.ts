import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OnboaringClientResourceProfileService } from '@tempus/client/onboarding-client/shared/data-access';
import { UserType } from '@tempus/client/shared/ui-components/persistent';
import { LoadView } from '../LoadView.model';

@Component({
	selector: 'tempus-resource-profile',
	templateUrl: './resource-profile.component.html',
	styleUrls: ['./resource-profile.component.scss'],
})
export class ResourceProfileComponent implements OnInit {
	constructor(private route: ActivatedRoute, private resourceService: OnboaringClientResourceProfileService) {}

	userType = UserType;

	firstName = '';

	lastName = '';

	country = '';

	state = '';

	city = '';

	email = '';

	phoneNumber = '';

	viewIndex = '';

	loadedView: LoadView = { isRevision: false };

	childRevisionLoaded(loadedView: LoadView) {
		this.loadedView = loadedView;
	}

	newViewClickEvent(viewIndex: string) {
		this.viewIndex = viewIndex;
	}

	displayName() {
		return `${this.firstName} ${this.lastName}`;
	}

	ngOnInit(): void {
		const id = this.route.snapshot.paramMap.get('id') || '';
		this.resourceService.getResourceInformation(id).subscribe(resourceInfo => {
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
