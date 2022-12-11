import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterResourcesComponent } from './filter-resources.component';

describe('FilterResourcesComponent', () => {
	let component: FilterResourcesComponent;
	let fixture: ComponentFixture<FilterResourcesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [FilterResourcesComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(FilterResourcesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
