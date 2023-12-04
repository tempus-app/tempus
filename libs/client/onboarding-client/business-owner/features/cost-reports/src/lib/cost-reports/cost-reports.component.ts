// cost-reports.component.ts
import { Component, OnInit } from '@angular/core';
import { TableDataModel } from '@tempus/client/shared/ui-components/presentational';
import {
	OnboardingClientState,
	selectLoggedInUserId,
	OnboardingClientResourceService,
	OnboardingClientProjectService,
	selectLoggedInRoles,
} from '@tempus/client/onboarding-client/shared/data-access';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Client, Project, Resource, RoleType } from '@tempus/shared-domain';
import { ReportService } from './report.service';

export interface CostReport {
	clientName: string;
	projectName: string;
	userName: string;
	taskName: string;
	month: string;
	position: string;
	hoursWorked: number;
	costRate: number;
	totalCost: number;
}

// Extend TableDataModel
export interface CostReportsTableData extends TableDataModel, CostReport {
	// Add any additional fields if needed
}

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'app-cost-reports',
	templateUrl: './cost-reports.component.html',
	styleUrls: ['./cost-reports.component.scss'],
})
export class CostReportsComponent implements OnInit {
	constructor(
		private reportService: ReportService,
		private store: Store<OnboardingClientState>,
		private resourceService: OnboardingClientResourceService,
		private projectService: OnboardingClientProjectService,
		private http: HttpClient,
		private fb: FormBuilder,
	) {}

	costReportsTableData: CostReportsTableData[] = [];

	pageNum = 1;

	totalCostReports = 1;

	userId = 0;

	dropdownOptions: { val: string; id: number }[] = [];

	clients: Client[] = [];

	clientOptions: { val: string; id: number }[] = [{ val: 'No clients assigned', id: 0 }];

	projects: Project[] = [];

	projectOptions: { val: string; id: number }[] = [{ val: 'No projects assigned', id: 0 }];

	resources: Resource[] = [];

	resourceOptions: { val: string; id: number }[] = [{ val: 'No resources assigned', id: 0 }];

	monthOptions: { val: string; id: number }[] = [
		{ val: 'January', id: 1 },
		{ val: 'February', id: 2 },
		{ val: 'March', id: 3 },
		{ val: 'April', id: 4 },
		{ val: 'May', id: 5 },
		{ val: 'June', id: 6 },
		{ val: 'July', id: 7 },
		{ val: 'August', id: 8 },
		{ val: 'September', id: 9 },
		{ val: 'October', id: 10 },
		{ val: 'November', id: 11 },
		{ val: 'December', id: 12 },
	];

	yearOptions: { val: string; id: number }[] = Array.from({ length: 8 }, (_, index) => {
		const year = new Date().getFullYear() - index;
		return { val: year.toString(), id: year };
	});

	dropdowns = [
		{ name: 'project', label: 'Project' },
		{ name: 'user', label: 'User' },
		{ name: 'client', label: 'Client' },
		{ name: 'month', label: 'Month' },
		{ name: 'year', label: 'Year' },
	];

	// Ensure tableColumns is of type Column[]
	// tableColumns: Column[] = [
	// 	{ columnDef: 'clientName', header: 'Client Name', cell: (element: CostReportsTableData) => element.clientName },
	// 	{
	// 		columnDef: 'projectName',
	// 		header: 'Project Name',
	// 		cell: (element: CostReportsTableData) => element.projectName,
	// 	},
	// 	{
	// 		columnDef: 'userName',
	// 		header: 'User Name',
	// 		cell: (element: CostReportsTableData) => `${element.userName}`,
	// 	},
	// 	{
	// 		columnDef: 'taskName',
	// 		header: 'Task Name',
	// 		cell: (element: CostReportsTableData) => `${element.taskName}`,
	// 	},
	// 	{
	// 		columnDef: 'month',
	// 		header: 'Month',
	// 		cell: (element: CostReportsTableData) => `${element.month}`,
	// 	},
	// 	{
	// 		columnDef: 'position',
	// 		header: 'Position',
	// 		cell: (element: CostReportsTableData) => `${element.position}`,
	// 	},
	// 	{
	// 		columnDef: 'hoursWorked',
	// 		header: 'Hours Worked',
	// 		cell: (element: CostReportsTableData) => `${element.hoursWorked}`,
	// 	},
	// 	{
	// 		columnDef: 'costRate',
	// 		header: 'Cost Rate',
	// 		cell: (element: CostReportsTableData) => `${element.costRate}`,
	// 	},
	// 	{
	// 		columnDef: 'totalCost',
	// 		header: 'Total Cost',
	// 		cell: (element: CostReportsTableData) => `${element.totalCost}`,
	// 	},
	// ];

	constructor(private reportService: ReportService) {}

	ngOnInit(): void {
		this.store.select(selectLoggedInUserId).subscribe(id => {
			if (id) {
				this.userId = id;

				this.populateClients(this.userId);
				this.populateProjects(this.userId);
				this.populateResources(this.userId);
			}
		});
	}

	generateDropdowns(): void {
		console.log('Generate Dropdowns clicked');
		// Implement the logic as needed
	}

	updateClients = () => {
		const id = this.reportForm.get('project')?.value;
		if (id === 0) {
			this.populateClients(this.userId);
			return;
		}
		this.projectService.getProject(id).subscribe(project => {
			if (project) {
				this.clientOptions = [{ val: project.client.clientName, id: project.client.id }];
				this.clientOptions.push({ val: ' ', id: 0 });
			}
		});
	};

	// eslint-disable-next-line class-methods-use-this
	loadReports(): void {
		// eslint-disable-next-line no-console
		console.log('hi');
	}

	onDropdownSelect(event: any, dropdownName: string): void {
		console.log(`Selected option in Dropdown ${dropdownName}:`, event);
	}

	populateProjects(userId: number) {
		let role;
		this.store.select(selectLoggedInRoles).subscribe(roles => {
			// eslint-disable-next-line prefer-destructuring
			role = roles.roles[0];
		});

		// Assuming you want to fetch the first page with a page size of 10
		const paginationData = {
			page: 1,
			pageSize: 10,
		};

		// he projects assigned to the resource supervised by supervisor
		if (role === RoleType.SUPERVISOR) {
			this.resourceService.getSupervisorProjects(userId).subscribe(projects => {
				// eslint-disable-next-line no-console
				console.log('Projects for Supervisor:', projects);
				if (projects) {
					this.projectOptions = projects.map(p => {
						return {
							val: p.name,
							id: p.id,
						};
					});
					this.projectOptions.push({ val: ' ', id: 0 });
				}
			});
		}
		// All the projects assigned to the resource
		else if (role === RoleType.ASSIGNED_RESOURCE || role === RoleType.AVAILABLE_RESOURCE) {
			this.resourceService.getResourceProjects(userId).subscribe(projects => {
				if (projects) {
					this.projectOptions = projects.map(p => {
						return {
							val: p.name,
							id: p.id,
						};
					});
					this.projectOptions.push({ val: 'All Projects', id: 0 });
				}
			});
		}

		// All the projects under that client
		else if (role === RoleType.CLIENT) {
			this.resourceService.getClientProjects(userId).subscribe(projects => {
				if (projects) {
					this.projectOptions = projects.map(p => {
						return {
							val: p.name,
							id: p.id,
						};
					});
					this.projectOptions.push({ val: 'All Projects', id: 0 });
				}
			});
		}
		// All the projects
		else {
			this.projectService.getAllProjects(paginationData).subscribe(response => {
				const projects = response.projectData;
				// eslint-disable-next-line no-console
				console.log(projects);
				if (projects) {
					this.projectOptions = projects.map(p => {
						return {
							val: p.name,
							id: p.id,
						};
					});
					this.projectOptions.unshift({ val: 'All Projects', id: 0 });
				}
			});
		}
	}

	populateResources(userId: number) {
		let role;
		this.store.select(selectLoggedInRoles).subscribe(roles => {
			// eslint-disable-next-line prefer-destructuring
			role = roles.roles[0];
		});

		// Reousrces assigned to that supervisor
		if (role === RoleType.SUPERVISOR) {
			this.resourceService.getSupervisorResources(userId).subscribe(resources => {
				// eslint-disable-next-line no-console
				console.log('Resources for Supervisor:', resources);
				if (resources) {
					this.resourceOptions = resources.map(r => {
						return {
							val: `${r.firstName} ${r.lastName}`,
							id: r.id,
						};
					});
					this.resourceOptions.push({ val: ' ', id: 0 });
				}
			});
		}
		// Should only display themselves
		else if (role === RoleType.ASSIGNED_RESOURCE || role === RoleType.AVAILABLE_RESOURCE) {
			this.resourceService.getResourceInformationById(userId).subscribe(resource => {
				if (resource) {
					this.resourceOptions = [
						{
							val: `${resource.firstName} ${resource.lastName}`,
							id: resource.id,
						},
					];
				}
			});
		}
		// Resources assigned to their project
		else if (role === RoleType.CLIENT) {
			this.resourceService.getClientResources(userId).subscribe(resources => {
				if (resources) {
					this.resourceOptions = resources.map(r => ({
						val: `${r.firstName} ${r.lastName}`,
						id: r.id,
					}));
					this.resourceOptions.push({ val: ' ', id: 0 });
				}
			});
		}
		// All resources
		else {
			this.resourceService.getAllResources().subscribe(resources => {
				if (resources) {
					this.resourceOptions = resources.map(r => ({
						val: `${r.firstName} ${r.lastName}`,
						id: r.id,
					}));
					this.resourceOptions.push({ val: ' ', id: 0 });
				}
			});
		}
	}

	enableButton() {
		if (this.reportForm.valid) {
			this.buttonDisabled = false;
		} else {
			this.buttonDisabled = true;
		}
	}
}
