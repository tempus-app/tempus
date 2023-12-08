/* eslint-disable prefer-destructuring */
/* eslint-disable eqeqeq */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-lonely-if */
/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
// cost-reports.component.ts
import { Component, OnInit } from '@angular/core';
import { TableDataModel } from '@tempus/client/shared/ui-components/presentational';
import {
	OnboardingClientState,
	selectLoggedInUserId,
	OnboardingClientResourceService,
	OnboardingClientProjectService,
	selectLoggedInRoles,
	OnboardingClientTimesheetsService,
} from '@tempus/client/onboarding-client/shared/data-access';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Client, IReportFiltersDto, Project, Report, Resource, RoleType } from '@tempus/shared-domain';
import { CustomModalType, ModalService, ModalType } from '@tempus/client/shared/ui-components/modal';
import { MatDatepicker } from '@angular/material/datepicker';

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
	reportForm: FormGroup;

	constructor(
		private store: Store<OnboardingClientState>,
		private resourceService: OnboardingClientResourceService,
		private projectService: OnboardingClientProjectService,
		private timesheetService: OnboardingClientTimesheetsService,
		private http: HttpClient,
		private fb: FormBuilder,
		private modalService: ModalService,
	) {
		this.reportForm = this.fb.group({
			// ... other form controls ...
			resource: [''],
			client: [''],
			project: [''],
			month: [''],
			year: [''],
			startDate: ['', Validators.required],
			endDate: ['', Validators.required],
			// ... other form controls ...
		});
	}

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

	userRole = RoleType.USER;

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

		this.store.select(selectLoggedInRoles).subscribe(roles => {
			this.userRole = roles[0];
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
		if (this.userRole != RoleType.CLIENT) {
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
		}
	};

	// eslint-disable-next-line class-methods-use-this
	loadReports(): void {
		const reportFilters: IReportFiltersDto = {
			clientId: this.reportForm.get('client')?.value,
			projectId: this.reportForm.get('project')?.value,
			resourceId: this.reportForm.get('resource')?.value,
			month: this.reportForm.get('month')?.value,
			year: this.reportForm.get('year')?.value,
		};

		const resourceHeaders = [
			'Client Name',
			'Project Name',
			'Resource Name',
			'Timesheet Week',
			'Hours Total',
			'Cost Rate',
			'Total Cost',
		];

		const ownerHeaders = [
			'Client Name',
			'Project Name',
			'Resource Name',
			'Timesheet Week',
			'Hours Total',
			'Cost Rate',
			'Total Cost',
			'Bill Rate',
			'Total Bill',
		];

		const clientHeaders = [
			'Client Name',
			'Project Name',
			'Resource Name',
			'Timesheet Week',
			'Hours Total',
			'Bill Rate',
			'Total Bill',
		];

		this.timesheetService.getReport(this.userId, reportFilters).subscribe(
			reports => {
				if (reports.length != 0) {
					const csvData = this.convertArrayToCsv(reports);
					const rows: string[] = csvData.split('\n');

					if (
						this.userRole == RoleType.SUPERVISOR ||
						this.userRole === RoleType.ASSIGNED_RESOURCE ||
						this.userRole === RoleType.AVAILABLE_RESOURCE
					) {
						if (rows.length > 0) {
							const header: string[] = rows[0].split(',');

							for (let i = 0; i < Math.min(header.length, resourceHeaders.length); i++) {
								header[i] = resourceHeaders[i];
							}
							const modifiedCsvData: string = [header.join(','), ...rows.slice(1)].join('\n');
							const blob = new Blob([modifiedCsvData], { type: 'text/csv' });
							const link = document.createElement('a');

							link.href = window.URL.createObjectURL(blob);
							link.download = 'Cost_Report.csv';

							document.body.appendChild(link);
							link.click();
							document.body.removeChild(link);
						} else {
							this.openErrorModal(
								'No data was found. Try changing the parameters or make sure approved timesheets exist for you',
							);
						}
					} else if (this.userRole == RoleType.BUSINESS_OWNER) {
						if (rows.length > 0) {
							const header: string[] = rows[0].split(',');

							for (let i = 0; i < Math.min(header.length, ownerHeaders.length); i++) {
								header[i] = ownerHeaders[i];
							}
							const modifiedCsvData: string = [header.join(','), ...rows.slice(1)].join('\n');
							const blob = new Blob([modifiedCsvData], { type: 'text/csv' });
							const link = document.createElement('a');

							link.href = window.URL.createObjectURL(blob);
							link.download = 'Bill_Cost_Report.csv';

							document.body.appendChild(link);
							link.click();
							document.body.removeChild(link);
						} else {
							this.openErrorModal(
								'No data was found. Try changing the parameters or make sure approved timesheets exist for you',
							);
						}
					} else {
						if (rows.length > 0) {
							const header: string[] = rows[0].split(',');

							for (let i = 0; i < Math.min(header.length, clientHeaders.length); i++) {
								header[i] = clientHeaders[i];
							}
							const modifiedCsvData: string = [header.join(','), ...rows.slice(1)].join('\n');
							const blob = new Blob([modifiedCsvData], { type: 'text/csv' });
							const link = document.createElement('a');

							link.href = window.URL.createObjectURL(blob);
							link.download = 'Bill_Report.csv';

							document.body.appendChild(link);
							link.click();
							document.body.removeChild(link);
						} else {
							this.openErrorModal(
								'No data was found. Try changing the parameters or make sure approved timesheets exist for you',
							);
						}
					}
				} else {
					this.openErrorModal(
						'No data was found. Try changing the parameters or make sure approved timesheets exist for you',
					);
				}
			},
			error => {
				console.error(error);
			},
		);
	}

	private convertArrayToCsv(reports: Report[]): string {
		const header = Object.keys(reports[0]).join(',');
		const rows = reports.map(report => Object.values(report).join(','));
		return `${header}\n${rows.join('\n')}`;
	}

	populateClients(userId: number) {
		let role;
		this.store.select(selectLoggedInRoles).subscribe(roles => {
			// eslint-disable-next-line prefer-destructuring
			role = roles[0];
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
						this.reportForm.get('client')?.setValue(client.id);
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
		if (role != RoleType.CLIENT) {
			const defaultOption = this.clientOptions.find(option => option.id === 0);
			if (defaultOption) {
				this.reportForm.get('client')?.setValue(defaultOption.id);
			}
		}
	}

	populateProjects(userId: number) {
		let role;
		this.store.select(selectLoggedInRoles).subscribe(roles => {
			// eslint-disable-next-line prefer-destructuring
			role = roles[0];
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
		const defaultOption = this.projectOptions.find(option => option.id === 0);
		if (defaultOption) {
			this.reportForm.get('project')?.setValue(defaultOption.id);
		}
	}

	populateResources(userId: number) {
		let role;
		this.store.select(selectLoggedInRoles).subscribe(roles => {
			// eslint-disable-next-line prefer-destructuring
			role = roles[0];
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
					this.reportForm.get('resource')?.setValue(resource.id);
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
		if (role != RoleType.ASSIGNED_RESOURCE && role != RoleType.AVAILABLE_RESOURCE) {
			const defaultOption = this.resourceOptions.find(option => option.id === 0);
			if (defaultOption) {
				this.reportForm.get('resource')?.setValue(defaultOption.id);
			}
		}
	}

	enableButton() {
		if (this.reportForm.valid) {
			this.buttonDisabled = false;
		} else {
			this.buttonDisabled = true;
		}
	}

	openErrorModal = (errorMessage: string) => {
		this.modalService.open(
			{
				title: 'Error',
				confirmText: ' ',
				closeText: 'Okay',
				message: errorMessage,
				modalType: ModalType.ERROR,
				closable: true,
				id: 'error',
			},
			CustomModalType.INFO,
		);
	};
}
