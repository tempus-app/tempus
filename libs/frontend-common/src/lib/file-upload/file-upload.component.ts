import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'tempus-file-upload',
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
	files: File[] = [];

	fileType = '*';

	@Input()
	acceptedFileType = '';

	ngOnInit(): void {
		this.determineFileType();
	}

	onSelect(event: any) {
		this.files.push(...event.addedFiles);
	}

	onRemove(event: File) {
		this.files.splice(this.files.indexOf(event), 1);
	}

	determineFileType() {
		switch (this.acceptedFileType) {
			case 'image':
				this.fileType = 'image/*';
				break;
			case 'file':
				this.fileType = 'application/pdf,application/msword,.doc,.docx,text/plain';
				break;
			default:
				this.fileType = '*';
		}
	}
}
