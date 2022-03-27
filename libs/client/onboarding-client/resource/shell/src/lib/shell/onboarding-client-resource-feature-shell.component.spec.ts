import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceShellComponent } from './onboarding-client-resource-feature-shell.component';

describe('MyInfoOneComponent', () => {
	let component: ResourceShellComponent;
	let fixture: ComponentFixture<ResourceShellComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ResourceShellComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ResourceShellComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
