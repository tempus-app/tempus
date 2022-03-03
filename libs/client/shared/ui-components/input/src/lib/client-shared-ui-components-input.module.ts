import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { TextAreaComponent } from './text-area/text-area.component';
import { TextInputComponent } from './text-input/text-input.component';
import { DropdownComponent } from './dropdown/dropdown.component';

@NgModule({
	imports: [
		CommonModule,
		MatInputModule,
		MatIconModule,
		MatSelectModule,
		BrowserAnimationsModule,
		NgxDropzoneModule,
		MatAutocompleteModule,
		FormsModule,
		ReactiveFormsModule,
		MatChipsModule,
		MatCardModule,
		MatFormFieldModule,
	],
	declarations: [DropdownComponent, FileUploadComponent, SearchBoxComponent, TextAreaComponent, TextInputComponent],
	exports: [DropdownComponent, FileUploadComponent, SearchBoxComponent, TextAreaComponent, TextInputComponent],
})
export class ClientSharedUiComponentsInputModule {}
