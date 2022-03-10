import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

	constructor(private router: Router, private route: ActivatedRoute) {}

	ngOnInit(): void {
		this.formGroup = new FormGroup(
			{
				email: new FormControl({ value: this.email, disabled: true }, Validators.required),
				password: new FormControl(null, [
					Validators.required,
					// taken from: https://stackoverflow.com/questions/40529817/reactive-forms-mark-fields-as-touched
				]),
				confirmPassword: new FormControl(null, Validators.required),
				consent: new FormControl(null, Validators.requiredTrue),
			},
			{ validators: validatePasswords },
		);
	}

	signUp() {
		this.formGroup?.markAllAsTouched();
		if (this.formGroup?.valid) {
			this.router.navigate(['../uploadresume'], { relativeTo: this.route });
		}
	}
}
