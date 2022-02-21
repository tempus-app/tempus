import {
  AfterViewInit,
  Component,
  ContentChildren,
  Directive,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  EventEmitter,
  ViewChild,
} from '@angular/core'
import { MatSort, Sort } from '@angular/material/sort'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { v4 as uuid } from 'uuid'

@Directive({
  selector: '[tempusTableCol]',
})
export class TableColumnDirective {
  id = uuid()
  @Input('tempusTableCol') title?: string
  constructor(public templateRef: TemplateRef<TableColumnDirective>) {}
}

@Component({
  selector: 'tempus-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements AfterViewInit, OnDestroy {
  @ContentChildren(TableColumnDirective) colTemplates!: QueryList<TableColumnDirective>
  @Input() data: any[] = []
  @Input() loading = false

  @Input() rowClick = new EventEmitter()

  @Output() sortChange = new EventEmitter<Sort>(true)
  @ViewChild(MatSort) sort?: MatSort

  @Input() activeSort?: Sort

  private _onDestroy$ = new Subject<void>()

  ngAfterViewInit() {
    if (this.sort) {
      this.sort.sortChange.pipe(takeUntil(this._onDestroy$)).subscribe((sort) => {
        this.sortChange.emit(sort)
      })
    }
  }
  ngOnDestroy() {
    this._onDestroy$.next()
    this._onDestroy$.complete()
  }
}
