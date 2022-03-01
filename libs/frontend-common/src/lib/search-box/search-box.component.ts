import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, of, startWith } from 'rxjs';

@Component({
	selector: 'tempus-search-box',
	templateUrl: './search-box.component.html',
	styleUrls: ['./search-box.component.scss'],
})
export class SearchBoxComponent implements OnInit {
	myControl = new FormControl();

	search = '';

	@Input() cssClass = 'secondary';

	@Input() placeholder = '';

	@Input() options: string[] = [];

	filteredOptions: Observable<string[]>;

	constructor() {
		this.filteredOptions = of([]);
	}

	ngOnInit() {
		this.filteredOptions = this.myControl.valueChanges.pipe(
			startWith(''),
			map(value => this._filter(value)),
		);
	}

	private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.options.filter(option => option.toLowerCase().includes(filterValue));
	}
}
