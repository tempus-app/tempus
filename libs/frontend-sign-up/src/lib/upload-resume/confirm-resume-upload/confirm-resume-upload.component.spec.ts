import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmResumeUploadComponent } from './confirm-resume-upload.component';

describe('ConfirmResumeUploadComponent', () => {
	let component: ConfirmResumeUploadComponent;
	let fixture: ComponentFixture<ConfirmResumeUploadComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ConfirmResumeUploadComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ConfirmResumeUploadComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
