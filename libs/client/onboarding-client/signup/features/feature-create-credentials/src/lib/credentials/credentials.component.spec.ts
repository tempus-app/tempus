import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredentialsComponent } from './credentials.component';

describe('MyInfoOneComponent', () => {
	let component: CredentialsComponent;
	let fixture: ComponentFixture<CredentialsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [CredentialsComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CredentialsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
