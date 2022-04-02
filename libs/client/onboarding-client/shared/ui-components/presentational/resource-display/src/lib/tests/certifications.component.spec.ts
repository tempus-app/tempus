import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationsComponent } from '../components/certifications/certifications.component';

describe('CertificationsComponent', () => {
	let component: CertificationsComponent;
	let fixture: ComponentFixture<CertificationsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [CertificationsComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CertificationsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
