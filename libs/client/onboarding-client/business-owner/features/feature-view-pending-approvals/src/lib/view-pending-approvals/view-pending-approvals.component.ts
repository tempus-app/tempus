/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
	BusinessOwnerState,
	getAllViewsByStatus,
	selectViewsByStatus,
} from '@tempus/client/onboarding-client/business-owner/data-access';
import { Column, PendingApprovalsTableData } from '@tempus/client/shared/ui-components/presentational';
import { RevisionType } from '@tempus/shared-domain';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
	selector: 'tempus-view-pending-approvals',
	templateUrl: './view-pending-approvals.component.html',
	styleUrls: ['./view-pending-approvals.component.scss'],
})
export class ViewPendingApprovalsComponent implements OnInit {
	prefix = 'onboardingOwnerViewPendingApprovals';

	tableColumns: Array<Column> = [];

  pageNum: number = 0;

  pageSize: number = 2;

  totalPendingApprovals: number = 0;

	constructor(private businessOwnerStore: Store<BusinessOwnerState>, private translateService: TranslateService) {
		const { currentLang } = translateService;
		translateService.currentLang = '';
		translateService.use(currentLang);
		this.translateService
			.get(`${this.prefix}.main.tableHeaders`)
			.pipe(take(1))
			.subscribe(data => {
				this.tableColumns = [
					{
						columnDef: 'resource',
						header: data['resource'],
						cell: (element: Record<string, unknown>) =>
							`<div class="demarginizedCell">${element['resource']} - ${element['type']} <p id="resource" class="mat-caption">(${element['email']})</p></div>`,
					},
					{
						columnDef: 'lastUpdated',
						header: data['lastUpdated'],
						cell: (element: Record<string, unknown>) => `${element['lastUpdated']}`,
					},
				];
			});
	}

	$destroyed = new Subject<void>();

	pendingApprovalsTableData: PendingApprovalsTableData[] = [];

	ngOnInit(): void {
		this.businessOwnerStore.dispatch(getAllViewsByStatus({ status: RevisionType.PENDING, pageSize: this.pageSize, pageNum: this.pageNum }));

		this.businessOwnerStore
			.select(selectViewsByStatus)
			.pipe(takeUntil(this.$destroyed))
			.subscribe(data => {
				this.pendingApprovalsTableData = [];
        this.totalPendingApprovals = data.totalNumItems;
				data?.views?.forEach(view => {
					let date = '-';
					let { type } = view;
					if (view.lastUpdateDate) {
						date = new Date(view.lastUpdateDate).toISOString().slice(0, 10) || '-';
					}
					if (type === 'PROFILE') {
						type = 'Primary';
					}
					this.pendingApprovalsTableData.push({
						type,
						lastUpdated: date,
						resource: `${view.resource.firstName} ${view.resource.lastName}`,
						url: `../view-resources/${view.resource.id}`,
						urlQueryParams: { viewId: view.id },
						columnsWithUrl: ['resource'],
						email: view.resource.email,
						columnsWithIcon: [],
					});
				});
			});
	}

  tablePaginationEvent(pageEvent: PageEvent) {
		if (pageEvent.pageSize != this.pageSize) {
			this.pageSize = pageEvent.pageSize;
      this.pageNum = 0;
		} else if (pageEvent.pageIndex != this.pageNum) {
			this.pageNum = pageEvent.pageIndex;
		}
		this.businessOwnerStore.dispatch(getAllViewsByStatus({ status: RevisionType.PENDING, pageSize: this.pageSize, pageNum: this.pageNum }));
	}
}
