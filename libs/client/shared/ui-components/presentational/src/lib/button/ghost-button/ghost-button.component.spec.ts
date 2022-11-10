import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GhostButtonComponent } from './ghost-button.component';

describe('GhostButtonComponent', () => {
	let component: GhostButtonComponent;
	let fixture: ComponentFixture<GhostButtonComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [GhostButtonComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(GhostButtonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
