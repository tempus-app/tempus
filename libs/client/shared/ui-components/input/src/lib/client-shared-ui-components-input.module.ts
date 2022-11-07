import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { MatDialogModule } from '@angular/material/dialog';
import { ClientSharedUiComponentsModalModule } from '@tempus/client/shared/ui-components/modal';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { TextAreaComponent } from './text-area/text-area.component';
import { TextInputComponent } from './text-input/text-input.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { CreateProjectModalComponent } from './create-project-modal/create-project-modal.component';

function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n', '.json');
}

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		MatInputModule,
		MatIconModule,
		ClientSharedUiComponentsPresentationalModule,
		ClientSharedUiComponentsModalModule,
		MatDialogModule,
		MatSlideToggleModule,
		MatSelectModule,
		NgxDropzoneModule,
		MatAutocompleteModule,
		FormsModule,
		ReactiveFormsModule,
		MatChipsModule,
		MatCardModule,
		MatFormFieldModule,
		TranslateModule.forChild({
			loader: {
				provide: TranslateLoader,
				useFactory: createTranslateLoader,
				deps: [HttpClient],
			},
			isolate: false,
			extend: true,
		}),
	],
	declarations: [
		DropdownComponent,
		FileUploadComponent,
		SearchBoxComponent,
		TextAreaComponent,
		TextInputComponent,
		CreateProjectComponent,
		CreateProjectModalComponent,
	],
	exports: [
		DropdownComponent,
		FileUploadComponent,
		SearchBoxComponent,
		TextAreaComponent,
		TextInputComponent,
		CreateProjectComponent,
		CreateProjectModalComponent,
	],
})
export class ClientSharedUiComponentsInputModule {}
