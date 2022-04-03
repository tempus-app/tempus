import { Component, OnInit, Input, EventEmitter, Output, forwardRef, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, map, startWith, tap } from 'rxjs';

@Component({
	selector: 'tempus-search-box',
	templateUrl: './search-box.component.html',
	styleUrls: ['./search-box.component.scss'],
})
export class SearchBoxComponent implements OnInit, OnChanges {
	
	@Input() control = new FormControl();

	search = '';

	@Input() cssClass = 'secondary';

	@Input() placeholder = '';

	@Input() options: string[] = [];

	filteredOptions: BehaviorSubject<string[]> = new BehaviorSubject(this.options);

	@Output() optionSelect = new EventEmitter();

	ngOnInit() {
		this.control.valueChanges.pipe(
			startWith(''),
			map(value => {
				if (value === '') {
					this.optionSelect.emit('');
				}
				return this._filter(value)
			}),
			tap(data => {
				this.filteredOptions.next(data)
			})
		).subscribe()
	}
	
	ngOnChanges(changes: SimpleChanges): void {
		if (changes['options'].previousValue !== changes['options'].currentValue) {
			this.filteredOptions.next(this._filter(this.control.value))
		}
	}

	optionSelected(option: string) {
		this.optionSelect.emit(option);
	}

	private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();
		return this.options.filter(option => option.toLowerCase().includes(filterValue));
	}
}
