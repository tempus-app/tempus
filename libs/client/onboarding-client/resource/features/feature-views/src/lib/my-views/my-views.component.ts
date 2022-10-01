import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private resourceService: OnboardingClientResourceService,
	) {}

	userId = 0;

	firstName = '';

	lastName = '';

	fullName = '';

	email = '';

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

	navigateToCreateNewView() {
		this.router.navigate(['./new'], { relativeTo: this.route });
	}
}
