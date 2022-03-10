import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingCtaComponent } from './landing-cta.component';

describe('LandingCtaComponent', () => {
	let component: LandingCtaComponent;
	let fixture: ComponentFixture<LandingCtaComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [LandingCtaComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(LandingCtaComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
