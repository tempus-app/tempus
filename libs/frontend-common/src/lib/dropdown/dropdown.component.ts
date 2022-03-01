import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'tempus-dropdown',
	templateUrl: './dropdown.component.html',
	styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit {
	@Input() options = '';

	@Input() cssClass = 'secondary';

	@Input() label = '';

	constructor() {}

	ngOnInit(): void {}
}
