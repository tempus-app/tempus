import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProjectsDisplayComponent } from './my-projects-display.component';

describe('MyProjectsDisplayComponent', () => {
	let component: MyProjectsDisplayComponent;
	let fixture: ComponentFixture<MyProjectsDisplayComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MyProjectsDisplayComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(MyProjectsDisplayComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
