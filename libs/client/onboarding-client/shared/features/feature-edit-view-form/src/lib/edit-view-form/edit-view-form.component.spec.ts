import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditViewFormComponent } from './edit-view-form.component';

describe('EditViewFormComponent', () => {
	let component: EditViewFormComponent;
	let fixture: ComponentFixture<EditViewFormComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [EditViewFormComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(EditViewFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
