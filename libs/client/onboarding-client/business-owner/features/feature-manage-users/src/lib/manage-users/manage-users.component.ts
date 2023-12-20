import { Component, OnInit } from '@angular/core';
import { IUpdateResourceDto, Resource } from '@tempus/shared-domain';
import { OnboardingClientResourceService } from '@tempus/client/onboarding-client/shared/data-access';
import { Column, ProjectManagmenetTableData } from '@tempus/client/shared/ui-components/presentational';

@Component({
	selector: 'tempus-manage-users',
	templateUrl: './manage-users.component.html',
	styleUrls: ['./manage-users.component.scss'],
})
export class ManageUsersComponent implements OnInit {
	resources: Resource[] = [];

	tableData: ProjectManagmenetTableData[] = [];

	displayedColumns: string[] = ['resource', 'active']; // Use string array for column definitions

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
		console.log(resource);
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
			active: resource.active,
		};
	}

	onActiveChange(resource: ProjectManagmenetTableData): void {
		const updatedResource: IUpdateResourceDto = {
			id: resource.resourceId,
			active: resource.active,
		};

		console.log('Updating resource:', updatedResource); // Add this line to log the object

		this.resourceService.editResourcePersonalInformation(updatedResource).subscribe(
			response => {
				console.log('Resource active status updated successfully', response);
			},
			error => {
				console.error('There was an error updating the resource active status', error);
			},
		);
	}
}
