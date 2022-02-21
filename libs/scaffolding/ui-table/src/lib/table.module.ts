import { NgModule } from '@angular/core'
import { MatSortModule } from '@angular/material/sort'
import { MatTableModule } from '@angular/material/table'
import { MatDividerModule } from '@angular/material/divider'
import { CommonModule } from '@angular/common'

@NgModule({
  imports: [CommonModule, MatSortModule, MatTableModule, MatDividerModule],
  exports: [],
  declarations: [],
})
export class TableModule {}
