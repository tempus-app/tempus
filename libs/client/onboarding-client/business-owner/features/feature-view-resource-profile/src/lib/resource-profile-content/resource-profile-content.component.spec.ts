import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceProfileContentComponent } from './resource-profile-content.component';

describe('ResourceProfileContentComponent', () => {
	let component: ResourceProfileContentComponent;
	let fixture: ComponentFixture<ResourceProfileContentComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ResourceProfileContentComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ResourceProfileContentComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
