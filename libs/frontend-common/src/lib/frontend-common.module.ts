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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';	
import {MatFormFieldModule} from '@angular/material/form-field';	
import { FooterComponent } from './footer/footer.component'
import { StepperComponent } from './stepper/stepper.component'	
import { MatStepperModule } from '@angular/material/stepper'	
import { TableComponent } from './table/table.component';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';

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
    MatFormFieldModule,
    MatStepperModule,
    MatTableModule,
    MatSortModule

  ],
  declarations: [
    SearchBoxComponent,
    FileUploadComponent,
    TextAreaComponent,
    DropdownComponent,
    TextInputComponent,
    ChipComponent,
    CardComponent,
    StepperComponent,
    TableComponent,
    FooterComponent,
  ],
  exports: [
    SearchBoxComponent,
    FileUploadComponent,
    TextAreaComponent,
    DropdownComponent,
    TextInputComponent,
    ChipComponent,
    CardComponent,
    StepperComponent,
    TableComponent,
    FooterComponent,
  ],
})
export class FrontendCommon {}