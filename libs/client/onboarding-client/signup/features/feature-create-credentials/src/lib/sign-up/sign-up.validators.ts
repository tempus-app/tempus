import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const validatePasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
	const password = group.get('password')?.value;
	const confirmedPassword = group.get('confirmPassword')?.value;

	return password === confirmedPassword ? null : { doesNotMatch: true };
};
