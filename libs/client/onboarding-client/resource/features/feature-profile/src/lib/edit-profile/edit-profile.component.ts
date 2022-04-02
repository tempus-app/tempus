import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { OnboardingClientState } from '@tempus/client/onboarding-client/shared/data-access';
import { Subject } from 'rxjs';
import { ButtonType } from '@tempus/client/shared/ui-components/presentational';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ICreateCertificationDto, ICreateEducationDto, ICreateExperienceDto } from '@tempus/shared-domain';

@Component({
	selector: 'tempus-edit-profile',
	templateUrl: './edit-profile.component.html',
	styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements AfterViewInit, OnDestroy {
	constructor(
		private fb: FormBuilder,
		private changeDetector: ChangeDetectorRef,
		private store: Store<OnboardingClientState>,
		private router: Router,
		private route: ActivatedRoute,
	) {}

	viewChangesForm = this.fb.group({});

	@Input() firstName = '';

	@Input() lastName = '';

	@Input() phoneNumber = '';

	@Input() linkedInLink = '';

	@Input() githubLink = '';

	@Input() otherLink = '';

	@Input() country = '';

	@Input() state = '';

	@Input() city = '';

	@Input() profileSummary = '';

	@Input() educationsSummary = '';

	@Input() educations: Array<ICreateEducationDto> = [];

	@Input() experiencesSummary = '';

	@Input() workExperiences: Array<ICreateExperienceDto> = [];

	@Input() certifications: Array<ICreateCertificationDto> = [];

	@Input() skillsSummary = '';

	@Input() skills: string[] = [];

	destroyed$ = new Subject<void>();

	ButtonType = ButtonType;

	@Output()
	openEditView = new EventEmitter();

	@Output()
	closeEditViewClicked = new EventEmitter();

	ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	closeEditView() {
		this.closeEditViewClicked.emit('close');
	}

	ngAfterViewInit(): void {
		this.changeDetector.detectChanges();
	}

	loadFormGroup(eventData: FormGroup) {
		this.viewChangesForm = eventData;
		console.log(this.viewChangesForm);
	}


	submitChanges() {
		this.viewChangesForm?.markAllAsTouched();
		console.log(this.viewChangesForm);
		if (this.viewChangesForm?.valid) {
			//create new revision/view
			this.closeEditView();
		}
	}
}
