import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Column } from './column.model';
import { TableDataModel } from './table-data.model';

@Component({
	selector: 'tempus-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss'],
})
export class TableComponent<T> implements OnInit {
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
}
