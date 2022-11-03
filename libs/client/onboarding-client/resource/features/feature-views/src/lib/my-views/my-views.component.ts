/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { OnboardingClientResourceService } from '@tempus/client/onboarding-client/shared/data-access';
import { ButtonType, Column, MyViewsTableData } from '@tempus/client/shared/ui-components/presentational';
import { Subject, take } from 'rxjs';
import { TempusResourceState } from '@tempus/client/onboarding-client/resource/data-access';

@Component({
	selector: 'tempus-my-views',
	templateUrl: './my-views.component.html',
	styleUrls: ['./my-views.component.scss'],
	providers: [OnboardingClientResourceService],
})
export class MyViewsComponent implements OnInit {
	prefix = 'onboardingResourceMyViews';

	tableColumns: Array<Column> = [];

	constructor(
		private resourceStore: Store<TempusResourceState>,
		private router: Router,
		private route: ActivatedRoute,
		private translateService: TranslateService,
		private resourceService: OnboardingClientResourceService,
	) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
		this.translateService
			.get(`${this.prefix}.main.tableHeaders`)
			.pipe(take(1))
			.subscribe(data => {
				this.tableColumns = [
					{
						columnDef: 'resource',
						header: data.resource,
						cell: (element: Record<string, unknown>) => `${element['resource']}`,
					},
					{
						columnDef: 'type',
						header: data.type,
						cell: (element: Record<string, unknown>) => `${element['type']}`,
					},
					{
						columnDef: 'lastUpdated',
						header: data.lastUpdated,
						cell: (element: Record<string, unknown>) => `${element['lastUpdated']}`,
					},
				];
			});
	}

	$destroyed = new Subject<void>();

	myViewsTableData: MyViewsTableData[] = [];

	userId = 0;

	firstName = '';

	lastName = '';

	fullName = '';

	email = '';

	ButtonType = ButtonType;

	ngOnInit(): void {
		this.res;
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
