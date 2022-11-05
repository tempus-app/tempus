/* eslint-disable @typescript-eslint/dot-notation */
import {
	Component,
	OnInit,
	Input,
	SimpleChanges,
	OnChanges,
	ViewChild,
	AfterViewInit,
	Output,
	EventEmitter,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Column } from './column.model';
import { TableDataModel } from './table-data.model';

@Component({
	selector: 'tempus-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss'],
})
export class TableComponent<T> implements OnInit, OnChanges, AfterViewInit {
	@Output() paginatorEvent = new EventEmitter<PageEvent>();

	@ViewChild(MatPaginator, { read: true })
	paginator!: MatPaginator;

	@Input()
	page = 0;

	@Input()
	totalItems = 0;

	@Input()
	tableColumns: Array<Column> = [];

	@Input()
	// T extends giving problems, TODO: look into better way to define table data
	tableData: Array<TableDataModel> = [];

	displayedColumns: Array<string> = [];

	dataSource: MatTableDataSource<TableDataModel> = new MatTableDataSource();

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	constructor() {}

	ngOnInit(): void {
		this.displayedColumns = this.tableColumns.map(c => c.columnDef);
		this.dataSource = new MatTableDataSource(this.tableData);
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
	}

	pageOutput = (event: PageEvent) => {
		this.paginatorEvent.emit(event);
	};

	ngOnChanges(changes: SimpleChanges) {
		if (changes['tableData']?.currentValue !== changes['tableData']?.previousValue) {
			this.dataSource.data = this.tableData;
		}
		if (changes['tableColumns']?.currentValue !== changes['tableColumns']?.previousValue) {
			this.displayedColumns = this.tableColumns.map(c => c.columnDef);
		}
	}
}
