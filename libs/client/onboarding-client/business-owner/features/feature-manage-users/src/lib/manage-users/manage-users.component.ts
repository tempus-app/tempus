import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'tempus-manage-users',
	templateUrl: './manage-users.component.html',
	styleUrls: ['./manage-users.component.css'],
})
export class ManageUsersComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {
		console.log('manage-users works!');
	}
}
