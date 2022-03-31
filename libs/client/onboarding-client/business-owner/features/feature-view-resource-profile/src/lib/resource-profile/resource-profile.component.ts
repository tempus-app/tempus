import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OnboaringClientResourceProfileService } from '@tempus/client/onboarding-client/shared/data-access';
import { UserType } from '@tempus/client/shared/ui-components/persistent';
import { View } from '@tempus/shared-domain';

@Component({
	selector: 'tempus-resource-profile',
	templateUrl: './resource-profile.component.html',
	styleUrls: ['./resource-profile.component.scss'],
})
export class ResourceProfileComponent implements OnInit {
	constructor(private route: ActivatedRoute, private resourceService: OnboaringClientResourceProfileService) {}

	userType = UserType;

	id = '';

	firstName = '';

	lastName = '';

	country = '';

	state = '';

	city = '';

	email = '';

	phoneNumber = '';

	view!: View;

	childDropDownClicked(view: View) {
		this.view = view;
	}

	displayName() {
		return `${this.firstName} ${this.lastName}`;
	}

	ngOnInit(): void {
		this.id = this.route.snapshot.paramMap.get('id') || '';
		this.resourceService.getResourceInformation(this.id).subscribe(resourceInfo => {
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
