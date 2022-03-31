import { Component } from '@angular/core';
import { UserType } from '@tempus/client/shared/ui-components/persistent';
import { View } from '@tempus/shared-domain';

@Component({
	selector: 'tempus-resource-profile',
	templateUrl: './resource-profile.component.html',
	styleUrls: ['./resource-profile.component.scss'],
})
export class ResourceProfileComponent {
	userType = UserType;

	name = 'sample';

	email = 'sample@test.com';

	view!: View;

	childDropDownClicked(view: View) {
		this.view = view;
	}
}
