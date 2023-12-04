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

export interface CostReport {
	clientName: string;
	projectName: string;
	userName: string;
	taskName: string;
	month: number;
	year: number;
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
		private store: Store<OnboardingClientState>,
		private resourceService: OnboardingClientResourceService,
		private projectService: OnboardingClientProjectService,
		private http: HttpClient,
		private fb: FormBuilder,
	) {}

	costReportsTableData: CostReportsTableData[] = [];

	pageNum = 1;

	labels = {
		client: 'Client',
		project: 'Project',
		resource: 'Resource',
		month: 'Month',
		year: 'Year',
	};

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

	reportForm = this.fb.group({
		resource: [''],
		client: [''],
		project: [''],
		month: ['', Validators.required],
		year: ['', Validators.required],
	});

	buttonDisabled = true;

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

	updateProjects = () => {
		const id = this.reportForm.get('client')?.value;
		if (id === 0) {
			this.populateProjects(this.userId);
			return;
		}
		this.projectService.getClientProjects(id).subscribe(projects => {
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
	};

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

	populateClients(userId: number) {
		let role;
		this.store.select(selectLoggedInRoles).subscribe(roles => {
			// eslint-disable-next-line prefer-destructuring
			role = roles.roles[0];
		});

		// The clients assigned to the resource supervised by supervisor
		if (role === RoleType.SUPERVISOR) {
			this.resourceService.getSupervisorClients(userId).subscribe(clients => {
				if (clients) {
					this.clientOptions = clients.map(c => {
						return {
							val: c.clientName,
							id: c.id,
						};
					});
					this.clientOptions.push({ val: ' ', id: 0 });
				}
			});
		}
		// All the clients assigned to the resource
		else if (role === RoleType.ASSIGNED_RESOURCE || role === RoleType.AVAILABLE_RESOURCE) {
			this.resourceService.getResourceClients(userId).subscribe(clients => {
				if (clients) {
					this.clientOptions = clients.map(c => {
						return {
							val: c.clientName,
							id: c.id,
						};
					});
					this.clientOptions.push({ val: ' ', id: 0 });
				}
			});
		}
		// If client is logged in, client dropdown will only have themselves.
		else if (role === RoleType.CLIENT) {
			this.resourceService.getUserInformationById(this.userId).subscribe(info => {
				// We get the client rep email
				if (info) {
					this.projectService.getClientByRepresentative(info.email).subscribe(client => {
						// We find the client from client rep email
						this.clientOptions = [{ val: client.clientName, id: client.id }];
					});
				}
			});
		}
		// Admin is logged in, display them all
		else {
			this.projectService.getClients().subscribe(clients => {
				if (clients) {
					this.clientOptions = clients.map(c => {
						return {
							val: c.clientName,
							id: c.id,
						};
					});
					this.clientOptions.push({ val: ' ', id: 0 });
				}
			});
		}
	}

	populateProjects(userId: number) {
		let role;
		this.store.select(selectLoggedInRoles).subscribe(roles => {
			// eslint-disable-next-line prefer-destructuring
			role = roles.roles[0];
		});

		const paginationData = {
			page: 0,
			pageSize: 50,
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
					this.projectOptions.push({ val: ' ', id: 0 });
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
					this.projectOptions.push({ val: ' ', id: 0 });
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
					this.projectOptions.unshift({ val: ' ', id: 0 });
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
