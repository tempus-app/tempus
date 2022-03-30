import { Component } from '@angular/core';

@Component({
	selector: 'tempus-user-bar',
	templateUrl: './user-bar.component.html',
	styleUrls: ['./user-bar.component.scss'],
})
export class UserBarComponent {
	currentView = '';

	views: string[] = [];
}
