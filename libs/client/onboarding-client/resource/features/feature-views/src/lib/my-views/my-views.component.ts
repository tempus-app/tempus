/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
	OnboardingClientResourceService,
	OnboardingClientState,
	selectLoggedInUserId,
	selectLoggedInUserNameEmail,
} from '@tempus/client/onboarding-client/shared/data-access';
import { ButtonType, Column, MyViewsTableData } from '@tempus/client/shared/ui-components/presentational';
import { Subject, take, takeUntil } from 'rxjs';
import {
	getAllViewsByResourceId,
	selectResourceViews,
	TempusResourceState,
} from '@tempus/client/onboarding-client/resource/data-access';

@Component({
	selector: 'tempus-my-views',
	templateUrl: './my-views.component.html',
	styleUrls: ['./my-views.component.scss'],
	providers: [OnboardingClientResourceService],
})
export class MyViewsComponent implements OnInit, OnDestroy {
	prefix = 'onboardingResourceMyViews';

	tableColumns: Array<Column> = [];

	constructor(
		private resourceStore: Store<TempusResourceState>,
		private router: Router,
		private route: ActivatedRoute,
		private translateService: TranslateService,
		private sharedStore: Store<OnboardingClientState>,
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
						columnDef: 'type',
						header: data.type,
						cell: (element: Record<string, unknown>) => `${element['type']}`,
					},
					{
						columnDef: 'createdBy',
						header: data.createdBy,
						cell: (element: Record<string, unknown>) => `${element['createdBy']}`,
					},
					{
						columnDef: 'dateCreated',
						header: data.dateCreated,
						cell: (element: Record<string, unknown>) => `${element['dateCreated']}`,
					},
					{
						columnDef: 'lastUpdated',
						header: data.lastUpdated,
						cell: (element: Record<string, unknown>) => `${element['lastUpdated']}`,
					},
					{
						columnDef: 'status',
						header: data.status,
						cell: (element: Record<string, unknown>) => `${element['status']}`,
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
		this.sharedStore
			.select(selectLoggedInUserId)
			.pipe(take(1))
			.subscribe(data => {
				if (data) {
					this.userId = data;
				}
			});
		this.sharedStore
			.select(selectLoggedInUserNameEmail)
			.pipe(take(1))
			.subscribe(data => {
				this.firstName = data.firstName || '';
				this.lastName = data.lastName || '';
				this.email = data.email || '';
			});

		this.resourceStore.dispatch(getAllViewsByResourceId({ resourceId: this.userId }));

		this.resourceStore
			.select(selectResourceViews)
			.pipe(takeUntil(this.$destroyed))
			.subscribe(data => {
				this.myViewsTableData = [];

				data?.forEach(view => {
					let lastUpdateDate = '-';
					let dateCreated = '-';
					let approvalStatus = '';
					let createdBy = 'CAL';
					let { type } = view;
					if (view.lastUpdateDate) {
						lastUpdateDate = new Date(view.lastUpdateDate).toISOString().slice(0, 10) || '-';
					}
					if (view.createdAt) {
						dateCreated = new Date(view.createdAt).toISOString().slice(0, 10) || '-';
					}

					if (view.createdBy === 'USER') {
						createdBy = 'Me';
					}
					if (type === 'PROFILE') {
						type = 'Primary';
					}

					if (view.revisionType) {
						approvalStatus = view.revisionType;
						if (approvalStatus === 'NEW') {
							approvalStatus = 'PENDING';
						}
					}

					this.myViewsTableData.push({
						type,
						lastUpdated: lastUpdateDate,
						dateCreated,
						createdBy,
						status: approvalStatus,
						url: `../my-views/${view.id}`,
						columnsWithUrl: ['type'],
						columnsWithIcon: [],
					});
				});
			});
		// this.res;
		// this.resourceService.getResourceInformation().subscribe(resData => {
		// 	this.userId = resData.id;
		// 	this.firstName = resData.firstName;
		// 	this.lastName = resData.lastName;
		// 	this.fullName = `${resData.firstName} ${resData.lastName}`;
		// 	this.email = resData.email;
		// });
	}

	ngOnDestroy(): void {
		this.$destroyed.next();
		this.$destroyed.complete();
	}

	navigateToCreateNewView() {
		this.router.navigate(['./new'], { relativeTo: this.route });
	}
}
