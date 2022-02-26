import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'tempus-text-area',
	templateUrl: './text-area.component.html',
	styleUrls: ['./text-area.component.scss'],
})
export class TextAreaComponent implements OnInit {
	@Input() cssClass = '';

	@Input() placeholder = '';

	constructor() {}

	ngOnInit(): void {}
}
