import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputType } from '@tempus/client/shared/ui-components/input';
import { Store } from '@ngrx/store';
import {
	createCredentials,
	selectCredentialsCreated,
	selectResourceData,
	SignupState,
} from '@tempus/client/onboarding-client/signup/data-access';
import { take, filter, switchMap, tap } from 'rxjs/operators';
import { validatePasswords } from './sign-up.validators';

@Component({
	selector: 'tempus-sign-up',
	templateUrl: './sign-up.component.html',
	styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
	@Input() email = '';

	createdCredentials: boolean | undefined;

	signupPrefix = 'onboardingSignupCredentials.main.';

	formGroup: FormGroup = new FormGroup(
		{
			email: new FormControl({ value: this.email, disabled: true }, Validators.required),
			password: new FormControl(null, [
				Validators.required,
				Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#_?&]{8,}$/),
				// taken from: https://stackoverflow.com/questions/40529817/reactive-forms-mark-fields-as-touched
			]),
			confirmPassword: new FormControl(null, Validators.required),
			consent: new FormControl(null, Validators.requiredTrue),
		},
		{ validators: validatePasswords },
	);

	InputType = InputType;

	constructor(private router: Router, private route: ActivatedRoute, private store: Store<SignupState>) {}

	ngOnChanges(changes: SimpleChanges): void {
		// eslint-disable-next-line @typescript-eslint/dot-notation
		this.formGroup.get('email')?.setValue(changes['email'].currentValue);
	}

	ngOnInit(): void {
		this.store
			.select(selectCredentialsCreated)
			.pipe(
				take(1),
				tap(created => {
					this.createdCredentials = created;
				}),
				filter(created => created),
				switchMap(_ => this.store.select(selectResourceData)),
				take(1),
			)
			.subscribe(createResourceDto => {
				this.formGroup.setValue({
					email: createResourceDto.email,
					password: createResourceDto.password,
					confirmPassword: createResourceDto.password,
					consent: true,
				});
			});
	}

	signUp() {
		this.formGroup?.markAllAsTouched();
		if (this.formGroup?.valid) {
			this.store.dispatch(
				createCredentials({
					password: this.formGroup.get('password')?.value,
					email: this.formGroup.get('email')?.value,
				}),
			);
			this.router.navigate(['../uploadresume'], { relativeTo: this.route });
		}
	}
}
