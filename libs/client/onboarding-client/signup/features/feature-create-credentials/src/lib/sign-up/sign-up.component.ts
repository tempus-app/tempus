import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InputType } from '@tempus/client/shared/ui-components/input';
import { validatePasswords } from './sign-up.validators';

@Component({
	selector: 'tempus-sign-up',
	templateUrl: './sign-up.component.html',
	styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
	@Input() email = '';

	formGroup: FormGroup | undefined;

	InputType = InputType;

	ngOnInit(): void {
		this.formGroup = new FormGroup(
			{
				email: new FormControl({ value: this.email, disabled: true }, Validators.required),
				password: new FormControl(null, [
					Validators.required,
					Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/),
					// taken from: https://stackoverflow.com/questions/40529817/reactive-forms-mark-fields-as-touched
				]),
				confirmPassword: new FormControl(null, Validators.required),
			},
			{ validators: validatePasswords },
		);
	}

	signUp() {
		this.formGroup?.markAllAsTouched();
		if (this.formGroup?.valid) {
			// do something (add to store)
		}
	}
}
