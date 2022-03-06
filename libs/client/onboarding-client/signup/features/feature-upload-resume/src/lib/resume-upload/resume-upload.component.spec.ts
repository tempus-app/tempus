import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeUploadComponent } from './resume-upload.component';

describe('ResumeUploadComponent', () => {
	let component: ResumeUploadComponent;
	let fixture: ComponentFixture<ResumeUploadComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ResumeUploadComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ResumeUploadComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
