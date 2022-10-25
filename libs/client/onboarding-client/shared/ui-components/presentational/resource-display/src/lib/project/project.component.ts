import { Component, Input } from '@angular/core';
import { Project, ProjectResource } from '@tempus/shared-domain';
import { formatDateRange } from '@tempus/client/shared/util';

@Component({
	selector: 'tempus-project',
	templateUrl: './project.component.html',
	styleUrls: ['./project.component.scss'],
})
export class ProjectComponent {
	@Input()
	projectResources: Array<ProjectResource> = [];

	formatDate(startDate: Date, endDate: Date | null) {
		return formatDateRange(new Date(startDate), endDate ? new Date(endDate) : endDate);
	}
}
