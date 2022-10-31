import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPendingApprovalsComponent } from './view-pending-approvals.component';

describe('ViewPendingApprovalsComponent', () => {
	let component: ViewPendingApprovalsComponent;
	let fixture: ComponentFixture<ViewPendingApprovalsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ViewPendingApprovalsComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ViewPendingApprovalsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
