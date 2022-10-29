/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
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
	prefix = 'onboardingOwnerViewPendingApprovals.';

	tableColumns: Array<Column> = [];

	constructor(private businessOwnerStore: Store<BusinessOwnerState>, private translateService: TranslateService) {
		const { currentLang } = translateService;
		translateService.currentLang = '';
		translateService.use(currentLang);
		this.translateService
			.get(`${this.prefix}main.tableHeaders`)
			.pipe(take(1))
			.subscribe(data => {
				this.tableColumns = [
					{
						columnDef: 'resource',
						header: data['resource'],
						cell: (element: Record<string, unknown>) =>
							`<div class="demarginizedCell">${element['resource']}<p id="resource" class="mat-caption">(${element['email']})</p></div>`,
					},
					{
						columnDef: 'type',
						header: data['type'],
						cell: (element: Record<string, unknown>) => `${element['type']}`,
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
		this.businessOwnerStore.dispatch(getAllViewsByStatus({ status: RevisionType.PENDING }));

		this.businessOwnerStore
			.select(selectViewsByStatus)
			.pipe(takeUntil(this.$destroyed))
			.subscribe(data => {
				this.pendingApprovalsTableData = [];

				data?.forEach(view => {
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
						columnsWithUrl: ['resource'],
						email: view.resource.email,
						columnsWithIcon: [],
					});
				});
			});
	}
}
