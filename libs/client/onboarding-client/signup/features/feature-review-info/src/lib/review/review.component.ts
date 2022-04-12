import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ICreateExperienceDto, ICreateEducationDto, ICreateCertificationDto } from '@tempus/shared-domain';
import { CustomModalType, ModalService, ModalType } from '@tempus/client/shared/ui-components/modal';

import { Subject, take } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';

import {
	createResource,
	resetCreateResourceState,
	resetLinkState,
	selectResourceData,
	selectResourceStatus,
	selectUploadedResume,
	SignupState,
} from '@tempus/client/onboarding-client/signup/data-access';
import { Store } from '@ngrx/store';
import { AsyncRequestState } from '@tempus/client/onboarding-client/shared/data-access';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'tempus-review',
	templateUrl: './review.component.html',
	styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit, AfterViewInit {
	firstName = '';

	lastName = '';

	experiencesSummary = '';

	educationsSummary = '';

	skillsSummary = '';

	profileSummary = '';

	email = '';

	phoneNumber = '';

	country = '';

	state = '';

	city = '';

	linkedInLink = '';

	githubLink = '';

	otherLink = '';

	workExperiences: Array<ICreateExperienceDto> = [];

	educations: Array<ICreateEducationDto> = [];

	certifications: Array<ICreateCertificationDto> = [];

	skills: Array<string> = [];

	destroyed$ = new Subject<void>();

	loading = false;

	resume: File | null = null;

	reviewPrefix = 'onboardingClientSignupReview.';

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private store: Store<SignupState>,
		private changeDetector: ChangeDetectorRef,
		private translateService: TranslateService,
		private modalService: ModalService,
	) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
	}

	ngAfterViewInit(): void {
		this.changeDetector.detectChanges();
	}

	ngOnInit(): void {
		this.store
			.select(selectResourceData)
			.pipe(take(1))
			.subscribe(resData => {
				this.firstName = resData?.firstName;
				this.lastName = resData?.lastName;
				this.email = resData?.email;
				this.phoneNumber = resData?.phoneNumber;
				this.country = resData?.location?.country;
				this.state = resData?.location?.province;
				this.city = resData?.location?.city;
				this.linkedInLink = resData?.linkedInLink;
				this.githubLink = resData?.githubLink;
				this.otherLink = resData?.otherLink;
				this.profileSummary = resData?.profileSummary;
				this.skillsSummary = resData?.skillsSummary;
				this.educationsSummary = resData?.educationsSummary;
				this.experiencesSummary = resData?.experiencesSummary;
				this.skills = resData?.skills.map(skill => skill.skill.name);
				this.workExperiences = resData?.experiences;
				this.certifications = resData?.certifications;
				this.educations = resData?.educations;
			});
		this.store.select(selectUploadedResume).subscribe(resumeData => {
			this.resume = resumeData;
		});
		this.store.select(selectResourceStatus).subscribe(reqStatusData => {
			if (reqStatusData.status === AsyncRequestState.LOADING) {
				this.loading = true;
			} else if (reqStatusData.status === AsyncRequestState.SUCCESS) {
				this.openSuccessDialog();
				this.loading = false;
				this.store.dispatch(resetLinkState());
				this.store.dispatch(resetCreateResourceState());
				this.router.navigate(['../../../signin'], { relativeTo: this.route });
			} else if (reqStatusData.status === AsyncRequestState.ERROR) {
				this.loading = false;
				this.openErrorDialog();
			} else {
				this.loading = false;
			}
		});
	}

	openSuccessDialog() {
		this.translateService
			.get(['onboardingClientSignupReview.modal.successModal'])
			.pipe(take(1))
			.subscribe(data => {
				const successDialogText = data['onboardingClientSignupReview.modal.successModal'];
				this.modalService.open(
					{
						title: successDialogText.title,
						confirmText: successDialogText.confirmText,
						message: successDialogText.message,
						modalType: ModalType.INFO,
						closable: true,
						id: 'success',
					},
					CustomModalType.INFO,
				);
			});

		this.modalService.confirmEventSubject.subscribe(() => {
			this.modalService.close();
			this.modalService.confirmEventSubject.unsubscribe();
		});
	}

	openErrorDialog() {
		this.translateService
			.get(['onboardingClientSignupReview.modal.errorModal'])
			.pipe(take(1))
			.subscribe(data => {
				const errorDialogText = data['onboardingClientSignupReview.modal.errorModal'];
				this.modalService.open(
					{
						title: errorDialogText.title,
						confirmText: errorDialogText.confirmText,
						message: errorDialogText.message,
						modalType: ModalType.ERROR,
						closable: true,
						id: 'error',
					},
					CustomModalType.INFO,
				);
			});

		this.modalService.confirmEventSubject.subscribe(() => {
			this.modalService.close();
			this.modalService.confirmEventSubject.unsubscribe();
		});
	}

	backStep() {
		this.router.navigate(['../myinfothree'], { relativeTo: this.route });
	}

	submit() {
		this.store.dispatch(createResource());
	}
}
