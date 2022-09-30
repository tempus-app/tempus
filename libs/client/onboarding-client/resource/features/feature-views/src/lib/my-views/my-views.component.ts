import { Component, OnInit } from '@angular/core';
import { OnboardingClientResourceService } from '@tempus/client/onboarding-client/shared/data-access';
import { UserType } from '@tempus/client/shared/ui-components/persistent';
import { ButtonType } from '@tempus/client/shared/ui-components/presentational';

@Component({
	selector: 'tempus-my-views',
	templateUrl: './my-views.component.html',
	styleUrls: ['./my-views.component.scss'],
	providers: [OnboardingClientResourceService],
})
export class MyViewsComponent implements OnInit {
	constructor(private resourceService: OnboardingClientResourceService) {}

	userId = 0;

	firstName = '';

	lastName = '';

	fullName = '';

	email = '';

	createViewEnabled = false;

	UserType = UserType;

	ButtonType = ButtonType;

	ngOnInit(): void {
		this.resourceService.getResourceInformation().subscribe(resData => {
			this.userId = resData.id;
			this.firstName = resData.firstName;
			this.lastName = resData.lastName;
			this.fullName = `${resData.firstName} ${resData.lastName}`;
			this.email = resData.email;
		});
	}

	openNewViewForm() {
		this.createViewEnabled = true;
	}

	closeNewViewForm() {
		this.createViewEnabled = false;
	}
}
