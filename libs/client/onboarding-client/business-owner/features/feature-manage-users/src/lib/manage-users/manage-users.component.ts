import { Component, OnInit } from '@angular/core';
import { Resource } from '@tempus/shared-domain';
import { OnboardingClientResourceService } from '@tempus/client/onboarding-client/shared/data-access';
import { Column, ProjectManagmenetTableData } from '@tempus/client/shared/ui-components/presentational';
import { MatCheckboxModule } from '@angular/material/checkbox'; // Import this if not already imported
// ... other properties ...

@Component({
	selector: 'tempus-manage-users',
	templateUrl: './manage-users.component.html',
	styleUrls: ['./manage-users.component.scss'],
})
export class ManageUsersComponent implements OnInit {
	resources: Resource[] = [];

	tableData: ProjectManagmenetTableData[] = [];

	displayedColumns: Column[] = [
		{ columnDef: 'resource', header: 'User', cell: (element: any) => `${element.resource}` },
		{ columnDef: 'active', header: 'Active', cell: (element: any) => 'Active' },
	];

	constructor(private resourceService: OnboardingClientResourceService) {}

	ngOnInit(): void {
		this.resourceService.getAllResources().subscribe(
			resources => {
				this.tableData = resources.map(resource => this.mapResourceToTableData(resource));
				console.log(this.tableData);
			},
			error => {
				console.error('There was an error fetching the resources', error);
			},
		);
	}

	private mapResourceToTableData(resource: Resource): ProjectManagmenetTableData {
		return {
			resourceId: resource.id,
			resource: `${resource.firstName} ${resource.lastName}`,
			assignment: '',
			client: '',
			email: resource.email,
			project: '',
			allProjects: [],
			allClients: [],
			delete: '',
			location: '',
			columnsWithIcon: [],
			columnsWithUrl: [],
			columnsWithChips: [],
			columnsWithButtonIcon: [],
		};
	}
}
