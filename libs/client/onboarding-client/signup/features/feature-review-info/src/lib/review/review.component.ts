import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ICreateExperienceDto, ICreateEducationDto, ICreateCertificationDto } from '@tempus/shared-domain';
import { CustomModalType, ModalService, ModalType } from '@tempus/client/shared/ui-components/modal';

import { skip, Subject, take, takeUntil } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';

import {
	createResource,
	resetCreateResourceState,
	resetLinkState,
	saveResume,
	selectCreatedResourceId,
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
export class ReviewComponent implements OnInit, OnDestroy, AfterViewInit {
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

	$destroyed = new Subject<void>();

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

	ngOnDestroy(): void {
		this.$destroyed.next();
		this.$destroyed.complete();
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
		this.store
			.select(selectUploadedResume)
			.pipe(take(1))
			.subscribe(resumeData => {
				if (resumeData) {
					// we don't save file name now so we have to standardize the name
					this.resume = new File([resumeData], 'original-resume.pdf', { type: resumeData.type });
				}
			});
		this.store
			.select(selectResourceStatus)
			.pipe(skip(1), takeUntil(this.$destroyed))
			.subscribe(reqStatusData => {
				if (reqStatusData.status === AsyncRequestState.LOADING) {
					this.loading = true;
				} else if (reqStatusData.status === AsyncRequestState.SUCCESS) {
					this.openDialog('successModal');
					this.loading = false;
					this.store.dispatch(resetLinkState());
					this.store.dispatch(resetCreateResourceState());
					this.router.navigate(['../../../signin'], { relativeTo: this.route });
				} else if (reqStatusData.status === AsyncRequestState.ERROR) {
					this.loading = false;
					this.openDialog('errorModal');
				} else {
					this.loading = false;
				}
			});
	}

	openDialog = (key: string) => {
		this.translateService
			.get([`onboardingClientSignupReview.modal.${key}`])
			.pipe(take(1))
			.subscribe(data => {
				const dialogText = data[`onboardingClientSignupReview.modal.${key}`];
				this.modalService.open(
					{
						title: dialogText.title,
						confirmText: dialogText.confirmText,
						message: dialogText.message,
						modalType: key === 'successModal' ? ModalType.INFO : ModalType.ERROR,
						closable: true,
						id: key,
					},
					CustomModalType.INFO,
				);
			});

		this.modalService.confirmEventSubject.subscribe(() => {
			this.modalService.close();
			this.modalService.confirmEventSubject.unsubscribe();
		});
	};

	backStep() {
		this.router.navigate(['../myinfothree'], { relativeTo: this.route });
	}

	submit() {
		this.store.dispatch(createResource());
		this.store
			.select(selectCreatedResourceId)
			.pipe(skip(1)) // take the latest value
			.subscribe(resourceId => {
				if (resourceId) {
					this.store.dispatch(saveResume({ resourceId }));
				}
			});
	}
}
