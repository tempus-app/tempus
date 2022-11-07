import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignResourceModalComponent } from './assign-resource-modal.component';

describe('AssignResourceModalComponent', () => {
	let component: AssignResourceModalComponent;
	let fixture: ComponentFixture<AssignResourceModalComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AssignResourceModalComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AssignResourceModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
