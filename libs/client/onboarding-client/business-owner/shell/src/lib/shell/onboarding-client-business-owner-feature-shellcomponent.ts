import { Component } from '@angular/core';
import { UserType } from '@tempus/client/shared/ui-components/persistent';

@Component({
	selector: 'tempus-business-owner-shell',
	templateUrl: './onboarding-client-business-owner-feature-shell.component.html',
	styleUrls: ['./onboarding-client-business-owner-feature-shell.component.scss'],
})
export class BusinessOnwerShellComponent {
	UserType = UserType;
}
