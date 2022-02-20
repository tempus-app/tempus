import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common';
import { SearchBoxComponent } from './search-box/search-box.component'
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { TextAreaComponent } from './text-area/text-area.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { TextInputComponent } from './text-input/text-input.component'
import {MatSelectModule} from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDropzoneModule } from 'ngx-dropzone';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

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
    
  ],
  declarations: [
    SearchBoxComponent,
    FileUploadComponent,
    TextAreaComponent,
    DropdownComponent,
    TextInputComponent,
  ],
  exports: [
    SearchBoxComponent,
    FileUploadComponent,
    TextAreaComponent,
    DropdownComponent,
    TextInputComponent
  ],
})
export class FrontendCommon {}
