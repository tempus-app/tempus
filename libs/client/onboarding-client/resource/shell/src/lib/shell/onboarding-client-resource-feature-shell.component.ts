import { Component } from '@angular/core';
import { UserType } from '@tempus/client/shared/ui-components/persistent';

@Component({
	selector: 'tempus-resource-shell',
	templateUrl: './onboarding-client-resource-feature-shell.component.html',
	styleUrls: ['./onboarding-client-resource-feature-shell.component.scss'],
})
export class ResourceShellComponent {
	UserType = UserType;
}
