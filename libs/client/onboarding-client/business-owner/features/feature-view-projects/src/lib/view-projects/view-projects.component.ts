/* eslint-disable no-param-reassign */
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
	BusinessOwnerState,
	getAllProjectInfo,
	selectAllProjects,
} from '@tempus/client/onboarding-client/business-owner/data-access';
import { OnboardingClientProjectService } from '@tempus/client/onboarding-client/shared/data-access';
import { Column, ViewProjects } from '@tempus/client/shared/ui-components/presentational';
import { ProjectStatus } from '@tempus/shared-domain';
import { take, Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'tempus-view-projects',
	templateUrl: './view-projects.component.html',
	styleUrls: ['./view-projects.component.scss'],
})
export class ViewProjectsComponent implements OnInit {
	prefix = 'onboardingOwnerViewProjects';

	tableColumns: Array<Column> = [];

	pageNum = 0;

	pageSize = 5;

	totalProjects = 0;

	constructor(
		private businessOwnerStore: Store<BusinessOwnerState>,
		private translateService: TranslateService,
		private projectService: OnboardingClientProjectService,
	) {
		const { currentLang } = translateService;
		translateService.currentLang = '';
		translateService.use(currentLang);
		this.translateService
			.get(`${this.prefix}.main.tableHeaders`)
			.pipe(take(1))
			.subscribe(data => {
				this.tableColumns = [
					{
						columnDef: 'project',
						header: data.project,
						cell: (element: Record<string, unknown>) => `${element.project}`,
					},
					{
						columnDef: 'name',
						header: data.name,
						cell: (element: Record<string, unknown>) => `${element.name}`,
					},
					{
						columnDef: 'start_date',
						header: data.start_date,
						cell: (element: Record<string, unknown>) => `${element.start_date}`,
					},
					{
						columnDef: 'status',
						header: data.status,
						cell: (element: Record<string, unknown>) => `${element.status}`,
					},
				];
			});
	}

	$destroyed = new Subject<void>();

	projectsInfoTableData: ViewProjects[] = [];

	ngOnInit(): void {
		this.businessOwnerStore.dispatch(getAllProjectInfo({ page: this.pageNum, pageSize: this.pageSize }));

		this.businessOwnerStore
			.select(selectAllProjects)
			.pipe(takeUntil(this.$destroyed))
			.subscribe(data => {
				this.projectsInfoTableData = [];
				this.totalProjects = data.totalItems;
				data.projects.forEach(project => {
					const startDate = new Date(project.startDate).toISOString().slice(0, 10);
					const status = project.status.toString() === 'not_started' ? 'Not Started' : project.status;
					this.projectsInfoTableData.push({
						name: project.client.clientName,
						project: project.name,
						start_date: startDate,
						status,
						columnsWithIcon: [],
						columnsWithUrl: [],
						columnsWithChips: [],
					});
				});
			});
	}

	tablePaginationEvent(pageEvent: PageEvent) {
		if (pageEvent.pageSize !== this.pageSize) {
			this.pageSize = pageEvent.pageSize;
			this.pageNum = 0;
		} else if (pageEvent.pageIndex !== this.pageNum) {
			this.pageNum = pageEvent.pageIndex;
		}
		this.businessOwnerStore.dispatch(getAllProjectInfo({ page: this.pageNum, pageSize: this.pageSize }));
	}
}
