import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManagementComponent } from './admin-management.component';

describe('MyInfoOneComponent', () => {
	let component: AdminManagementComponent;
	let fixture: ComponentFixture<AdminManagementComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AdminManagementComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AdminManagementComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
