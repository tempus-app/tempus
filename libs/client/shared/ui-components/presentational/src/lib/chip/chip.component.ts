import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'tempus-chip',
	templateUrl: './chip.component.html',
	styleUrls: ['./chip.component.scss'],
})
export class ChipComponent implements OnInit {
	@Input() cssId = 'skill';

	@Input() removable = true;

	@Input() typography = 'subheading-1';

	@Input() content = 'placeholder';

	@Output() onRemove: EventEmitter<any> = new EventEmitter();

	removeChip() {
		this.onRemove.emit('closed');
	}

	constructor() {}

	ngOnInit(): void {}
}
