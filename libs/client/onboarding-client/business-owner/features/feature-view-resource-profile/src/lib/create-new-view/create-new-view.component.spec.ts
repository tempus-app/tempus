import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessOwnerCreateNewViewComponent } from './create-new-view.component';

describe('BusinessOwnerCreateNewViewComponent', () => {
	let component: BusinessOwnerCreateNewViewComponent;
	let fixture: ComponentFixture<BusinessOwnerCreateNewViewComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [BusinessOwnerCreateNewViewComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(BusinessOwnerCreateNewViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
