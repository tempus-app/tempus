import { Component, OnInit, Input, EventEmitter, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { map, Observable, of, startWith } from 'rxjs';

@Component({
	selector: 'tempus-search-box',
	templateUrl: './search-box.component.html',
	styleUrls: ['./search-box.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SearchBoxComponent),
			multi: true,
		},
	],
})
export class SearchBoxComponent implements OnInit, ControlValueAccessor {
	myControl = new FormControl();

	search = '';

	@Input() cssClass = 'secondary';

	@Input() placeholder = '';

	@Input() options: string[] = [];

	filteredOptions: Observable<string[]>;

	@Output() optionSelect = new EventEmitter();

	val = '';

	constructor() {
		this.filteredOptions = of([]);
	}

	ngOnInit() {
		this.filteredOptions = this.myControl.valueChanges.pipe(
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

	onChange: any = () => {};

	onTouch: any = () => {};

	set value(val: string | undefined) {
		if (val !== undefined && this.val !== val) {
			this.val = val;
			this.onChange(val);
			this.onTouch(val);
		}
	}

	writeValue(value: any) {
		this.value = value;
	}

	registerOnChange(fn: any) {
		this.onChange = fn;
	}

	registerOnTouched(fn: any) {
		this.onTouch = fn;
	}
}
