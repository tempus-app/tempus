import { TestBed } from '@angular/core/testing';

import { ValidLinkGuard } from './valid-link.guard';

describe('ValidLinkGuard', () => {
	let guard: ValidLinkGuard;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		guard = TestBed.inject(ValidLinkGuard);
	});

	it('should be created', () => {
		expect(guard).toBeTruthy();
	});
});
