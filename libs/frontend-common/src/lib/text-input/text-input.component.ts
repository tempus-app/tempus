import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'tempus-text-input',
	templateUrl: './text-input.component.html',
	styleUrls: ['./text-input.component.scss'],
})
export class TextInputComponent implements OnInit {
	@Input() placeholder = '';
	@Input() cssClass: string = '';
	@Input() id: string = '';
	@Input() inputType: string = '';
	constructor() {}

	ngOnInit(): void {}
}
