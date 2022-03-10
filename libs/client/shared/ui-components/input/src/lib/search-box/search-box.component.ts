import { Component, OnInit, Input, EventEmitter, Output, forwardRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, of, startWith } from 'rxjs';

@Component({
	selector: 'tempus-search-box',
	templateUrl: './search-box.component.html',
	styleUrls: ['./search-box.component.scss'],
})
export class SearchBoxComponent implements OnInit {
	@Input() control = new FormControl();

	search = '';

	@Input() cssClass = 'secondary';

	@Input() placeholder = '';

	@Input() options: string[] = [];

	filteredOptions: Observable<string[]>;

	@Output() optionSelect = new EventEmitter();

	constructor() {
		this.filteredOptions = of([]);
	}

	ngOnInit() {
		this.filteredOptions = this.control.valueChanges.pipe(
			startWith(''),
			map(value => this._filter(value)),
		);
	}

	optionSelected(option: string) {
		this.optionSelect.emit(option);
	}

	private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();
		return this.options.filter(option => option.toLowerCase().includes(filterValue));
	}
}
