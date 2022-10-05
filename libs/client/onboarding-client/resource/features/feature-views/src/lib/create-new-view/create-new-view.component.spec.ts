import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewViewComponent } from './create-new-view.component';

describe('CreateNewViewComponent', () => {
	let component: CreateNewViewComponent;
	let fixture: ComponentFixture<CreateNewViewComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [CreateNewViewComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CreateNewViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
