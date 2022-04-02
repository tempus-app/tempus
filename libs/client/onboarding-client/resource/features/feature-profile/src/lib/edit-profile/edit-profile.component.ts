import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { OnboardingClientState } from '@tempus/client/onboarding-client/shared/data-access';
import { Subject } from 'rxjs';
import { ButtonType } from '@tempus/client/shared/ui-components/presentational';
import { FormBuilder } from '@angular/forms';
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

	myInfoForm = this.fb.group({});

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
		console.log(this.certifications);
	}

	// ngOnInit(): void {
	// 	// this.loadStoreData();
	// 	// this.formGroup.emit(this.myInfoForm);
	// }

	// loadStoreData() {
	// 	this.myInfoForm.patchValue({
	// 		firstName: this.firstName,
	// 		lastName: this.lastName,
	// 		phoneNumber: this.phoneNumber,
	// 		linkedInLink: this.linkedInLink,
	// 		githubLink: this.githubLink,
	// 		otherLink: this.otherLink,
	// 		country: this.country,
	// 		state: this.state,
	// 		city: this.city,
	// 		profileSummary: this.profileSummary,
	// 	});
	// 	console.log('edit-profile on init has');
	// 	console.log(this.firstName);
	// }

	// loadFormGroup(eventData: FormGroup) {
	// 	this.myInfoForm = eventData;
	// 	this.store
	// 		.select(selectUserDetailsCreated)
	// 		.pipe(
	// 			take(1),
	// 			filter(created => created),
	// 			switchMap(_ => this.store.select(selectResourceData)),
	// 			take(1),
	// 		)
	// 		.subscribe(createResourceDto => {
	// 			this.firstName = createResourceDto?.firstName;
	// 			this.lastName = createResourceDto?.lastName;
	// 			this.phoneNumber = createResourceDto?.phoneNumber;
	// 			this.country = createResourceDto?.location?.country;
	// 			this.state = createResourceDto?.location?.province;
	// 			this.city = createResourceDto?.location?.city;
	// 			this.linkedInLink = createResourceDto?.linkedInLink;
	// 			this.githubLink = createResourceDto?.githubLink;
	// 			this.otherLink = createResourceDto?.otherLink;
	// 			this.profileSummary = createResourceDto?.profileSummary;
	// 			this.myInfoForm.setValue({
	// 				firstName: createResourceDto.firstName,
	// 				lastName: createResourceDto.lastName,
	// 				phoneNumber: createResourceDto.phoneNumber,
	// 				linkedInLink: createResourceDto.linkedInLink,
	// 				githubLink: createResourceDto.githubLink,
	// 				otherLink: createResourceDto.otherLink,
	// 				country: createResourceDto.location.country,
	// 				state: createResourceDto.location.province,
	// 				city: createResourceDto.location.city,
	// 				profileSummary: createResourceDto.profileSummary,
	// 			});
	// 		});
	// }
}
