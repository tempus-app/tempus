import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { InputType } from '@tempus/client/shared/ui-components/input';
import { validatePasswords } from './sign-up.validators';

@Component({
	selector: 'tempus-sign-up',
	templateUrl: './sign-up.component.html',
	styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
	InputType = InputType;

	formGroup = new FormGroup(
		{
			email: new FormControl({ value: 'email3@email.com', disabled: true }, Validators.required),
			password: new FormControl(null, [
				Validators.required,
				Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/),
				// taken from: https://stackoverflow.com/questions/40529817/reactive-forms-mark-fields-as-touched
			]),
			confirmPassword: new FormControl(null, Validators.required),
		},
		{ validators: validatePasswords },
	);

	signUp() {
		this.formGroup.markAllAsTouched();
	}
}
