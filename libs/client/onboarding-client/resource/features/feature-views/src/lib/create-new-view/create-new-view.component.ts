import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { OnboardingClientResourceService } from '@tempus/client/onboarding-client/shared/data-access';
import { EditViewFormComponent } from 'libs/client/onboarding-client/shared/features/feature-edit-view-form/src/lib/edit-view-form/edit-view-form.component';

@Component({
	selector: 'tempus-create-new-view',
	templateUrl: './create-new-view.component.html',
	styleUrls: ['./create-new-view.component.scss'],
	providers: [OnboardingClientResourceService],
})
export class CreateNewViewComponent {
	constructor(private resourceService: OnboardingClientResourceService) {}

	@ViewChild(EditViewFormComponent) newViewForm!: EditViewFormComponent;

	@Output()
	closeFormClicked = new EventEmitter();

	closeForm() {
		this.closeFormClicked.emit();
	}
}
