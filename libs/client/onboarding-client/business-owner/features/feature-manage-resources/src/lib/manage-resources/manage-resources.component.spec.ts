import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageResourcesComponent } from './manage-resources.component';

describe('MyInfoOneComponent', () => {
	let component: ManageResourcesComponent;
	let fixture: ComponentFixture<ManageResourcesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ManageResourcesComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ManageResourcesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
