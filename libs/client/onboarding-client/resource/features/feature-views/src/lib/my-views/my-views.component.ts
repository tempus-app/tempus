/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
	OnboardingClientResourceService,
	OnboardingClientState,
	selectResourceDetails,
} from '@tempus/client/onboarding-client/shared/data-access';
import { ButtonType, Column, MyViewsTableData } from '@tempus/client/shared/ui-components/presentational';
import { Subject, take, takeUntil } from 'rxjs';
import {
	getAllViewsByResourceId,
	selectResourceViews,
	TempusResourceState,
} from '@tempus/client/onboarding-client/resource/data-access';
import { PageEvent } from '@angular/material/paginator';
import { RevisionType } from '@tempus/shared-domain';

@Component({
	selector: 'tempus-my-views',
	templateUrl: './my-views.component.html',
	styleUrls: ['./my-views.component.scss'],
	providers: [OnboardingClientResourceService],
})
export class MyViewsComponent implements OnInit, OnDestroy {
	prefix = 'onboardingResourceMyViews';

	tableColumns: Array<Column> = [];

	pageNum = 0;

	pageSize = 5;

	totalViews = 0;

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

	ButtonType = ButtonType;

	ngOnInit(): void {
		this.sharedStore
			.select(selectResourceDetails)
			.pipe(take(1))
			.subscribe(data => {
				this.userId = data.userId;
				this.firstName = data.firstName || '';
				this.lastName = data.lastName || '';
			});

		this.resourceStore.dispatch(
			getAllViewsByResourceId({ resourceId: this.userId, pageSize: this.pageSize, pageNum: this.pageNum }),
		);

		this.resourceStore
			.select(selectResourceViews)
			.pipe(takeUntil(this.$destroyed))
			.subscribe(data => {
				this.myViewsTableData = [];
				this.totalViews = data.totalViews;
				const viewTypeSet = new Set();
				const uniqueViews = data?.views?.filter(view => {
					const viewExists = viewTypeSet.has(view.type);
					let { type } = view;
					if (type === 'PROFILE') {
						type = 'Primary';
					}

					if (view.revision?.views) {
						const latestView = view.revision.views.find(v => v.revisionType !== RevisionType.APPROVED);
						if (latestView?.type !== view.type) {
							return false;
						}
					}

					viewTypeSet.add(view.type);
					return !viewExists;
				});

				uniqueViews?.forEach(view => {
					let dateCreated = '-';
					let approvalStatus = '';
					let createdBy = 'CAL';
					let { type } = view;
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
						if (approvalStatus === RevisionType.PENDING) {
							approvalStatus = 'PENDING';
						}
					}

					this.myViewsTableData.push({
						type,
						dateCreated,
						createdBy,
						status: approvalStatus,
						url: `../my-views/${view.id}`,
						columnsWithUrl: ['type'],
						columnsWithIcon: [],
						columnsWithChips: ['status'],
					});
				});
			});
	}

	ngOnDestroy(): void {
		this.$destroyed.next();
		this.$destroyed.complete();
	}

	tablePaginationEvent(pageEvent: PageEvent) {
		if (pageEvent.pageSize !== this.pageSize) {
			this.pageSize = pageEvent.pageSize;
			this.pageNum = 0;
		} else if (pageEvent.pageIndex !== this.pageNum) {
			this.pageNum = pageEvent.pageIndex;
		}
		this.resourceStore.dispatch(
			getAllViewsByResourceId({ resourceId: this.userId, pageSize: this.pageSize, pageNum: this.pageNum }),
		);
	}

	navigateToCreateNewView() {
		this.router.navigate(['./new'], { relativeTo: this.route });
	}
}
