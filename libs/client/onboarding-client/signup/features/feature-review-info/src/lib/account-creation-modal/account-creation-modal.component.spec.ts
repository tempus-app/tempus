import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCreationModalComponent } from './account-creation-modal.component';

describe('AccountCreationModalComponent', () => {
	let component: AccountCreationModalComponent;
	let fixture: ComponentFixture<AccountCreationModalComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AccountCreationModalComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AccountCreationModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
