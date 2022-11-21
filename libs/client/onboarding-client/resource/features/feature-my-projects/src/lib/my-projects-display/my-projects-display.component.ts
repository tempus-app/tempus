import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ProjectResource } from '@tempus/shared-domain';
import { TranslateService } from '@ngx-translate/core';
import { OnboardingClientResourceService } from '@tempus/client/onboarding-client/shared/data-access';

@Component({
	selector: 'tempus-my-projects-display',
	templateUrl: './my-projects-display.component.html',
	styleUrls: ['./my-projects-display.component.scss'],
})
export class MyProjectsDisplayComponent implements OnInit {
	$destroyed = new Subject<void>();

	projects: ProjectResource[] = [];

	projectPrefix = 'projectCard.';

	constructor(private resourceService: OnboardingClientResourceService, private translateService: TranslateService) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
	}

	ngOnInit(): void {
		this.resourceService.getResourceInformation().subscribe(resData => {
			this.projects = resData.projectResources;
		});
	}

	formatDate(date: Date) {
		return new Date(date).toISOString().slice(0, 10);
	}
}
