import { Component } from '@angular/core';
import { UserType } from '@tempus/client/shared/ui-components/persistent';
// import { UserBarComponent } from '../user-bar/user-bar.component';

@Component({
	selector: 'tempus-resource-profile',
	templateUrl: './resource-profile.component.html',
	styleUrls: ['./resource-profile.component.scss'],
})
export class ResourceProfileComponent {
	userType = UserType;

	name = 'sample';

	email = 'sample@test.com';
}
