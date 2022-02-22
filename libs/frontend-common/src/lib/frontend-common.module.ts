import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ChipComponent } from './chip/chip.component'
import { MatChipsModule } from '@angular/material/chips'
import { MatIconModule } from '@angular/material/icon'
import { CardComponent } from './card/card.component'
import { MatCardModule } from '@angular/material/card'
import { SearchBoxComponent } from './search-box/search-box.component'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { FileUploadComponent } from './file-upload/file-upload.component'
import { TextAreaComponent } from './text-area/text-area.component'
import { DropdownComponent } from './dropdown/dropdown.component'
import { TextInputComponent } from './text-input/text-input.component'
import { MatSelectModule } from '@angular/material/select'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgxDropzoneModule } from 'ngx-dropzone'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatSortModule } from '@angular/material/sort'
import { MatTableModule } from '@angular/material/table'
import { MatDividerModule } from '@angular/material/divider'
import { TableComponent } from './table/table.component'
import { MatProgressBarModule } from '@angular/material/progress-bar'

@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    BrowserAnimationsModule,
    NgxDropzoneModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule,
    MatCardModule,
    MatSortModule,
    MatTableModule,
    MatDividerModule,
    MatProgressBarModule,
  ],
  declarations: [
    SearchBoxComponent,
    FileUploadComponent,
    TextAreaComponent,
    DropdownComponent,
    TextInputComponent,
    ChipComponent,
    CardComponent,
    TableComponent,
  ],
  exports: [
    SearchBoxComponent,
    FileUploadComponent,
    TextAreaComponent,
    DropdownComponent,
    TextInputComponent,
    ChipComponent,
    CardComponent,
    TableComponent,
  ],
})
export class FrontendCommon {}
