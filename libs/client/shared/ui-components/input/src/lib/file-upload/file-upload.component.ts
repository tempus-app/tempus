import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';

@Component({
	selector: 'tempus-file-upload',
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
	files: File[] = [];

	@Input()
	fileType = '*';

	@Input()
	displayPreview = false;

	@Input()
	multiple = true;

	@Input()
	disableFileSelector = false;

	@Input()
	label = 'Drag and drop your files here';

	@Output()
	fileUploadChange = new EventEmitter();

	onSelect(event: NgxDropzoneChangeEvent) {
		this.files.push(...event.addedFiles);
		this.fileUploadChange.emit(...event.addedFiles);
	}

	onRemove(event: File) {
		this.files.splice(this.files.indexOf(event), 1);
	}
}
