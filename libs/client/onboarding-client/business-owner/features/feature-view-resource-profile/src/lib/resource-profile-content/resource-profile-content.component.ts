import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	TemplateRef,
	ViewChild,
} from '@angular/core';
import {
	ICreateCertificationDto,
	ICreateEducationDto,
	ICreateExperienceDto,
	View,
	Skill,
	LoadView,
	ViewNames,
	RevisionType,
} from '@tempus/shared-domain';
import { OnboardingClientResourceService } from '@tempus/client/onboarding-client/shared/data-access';
import { ModalService, CustomModalType, ModalType } from '@tempus/client/shared/ui-components/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';

@Component({
	selector: 'tempus-resource-profile-content',
	templateUrl: './resource-profile-content.component.html',
	styleUrls: ['./resource-profile-content.component.scss'],
	providers: [OnboardingClientResourceService],
})
export class ResourceProfileContentComponent implements OnInit, OnChanges {
	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private fb: FormBuilder,
		public modalService: ModalService,
		private resourceService: OnboardingClientResourceService,
		private translateService: TranslateService,
	) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
	}

	@Input()
	view!: View;

	@Input()
	firstName = '';

	@Input()
	lastName = '';

	@Input()
	email = '';

	@Input()
	phoneNumber = '';

	@Input()
	country = '';

	@Input()
	state = '';

	@Input()
	city = '';

	@Input()
	viewID = 0;

	@Input()
	resume: File | null = null;

	experiencesSummary = '';

	educationsSummary = '';

	skillsSummary = '';

	profileSummary = '';

	linkedInLink = '';

	githubLink = '';

	otherLink = '';

	workExperiences: Array<ICreateExperienceDto> = [];

	educations: Array<ICreateEducationDto> = [];

	certifications: Array<ICreateCertificationDto> = [];

	skills: Array<string> = [];

	viewName = '';

	isRevision = false;

	viewResourceProfilePrefx = 'viewResourceProfile.';

	viewResourceProfileForm = this.fb.group({
		rejectionComments: ['', Validators.required],
	});

	@ViewChild('modalID')
	template!: TemplateRef<unknown>;

	@Output() revisionViewLoaded = new EventEmitter<LoadView>();

	ngOnChanges(changes: SimpleChanges): void {
		// eslint-disable-next-line @typescript-eslint/dot-notation
		if (changes['viewID'] && changes['viewID'].currentValue !== 0) {
			// eslint-disable-next-line @typescript-eslint/dot-notation
			this.loadView(changes['viewID'].currentValue);
			// eslint-disable-next-line @typescript-eslint/dot-notation
		}
	}

	ngOnInit() {
		const id = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
		this.resourceService.getResourceProfileViews(id).subscribe(profileViews => {
			this.viewID = profileViews[0].id;
			const sortAndFilterViews = profileViews.sort((a, b) =>
				// eslint-disable-next-line no-nested-ternary
				a.lastUpdateDate && b.lastUpdateDate
					? new Date(a.lastUpdateDate).getTime() > new Date(b.lastUpdateDate).getTime()
						? -1
						: 1
					: a.createdAt.getTime() > b.createdAt.getTime()
					? -1
					: 1,
			);

			const revisionViewId = sortAndFilterViews[0].id;
			this.loadView(revisionViewId, profileViews);
		});
	}

	loadView(viewID: number, profileViews?: ViewNames[]) {
		this.viewID = viewID;
		this.resourceService.getViewById(viewID).subscribe(resourceView => {
			this.certifications = resourceView.certifications;
			this.educations = resourceView.educations;
			this.educationsSummary = resourceView.educationsSummary;
			this.workExperiences = resourceView.experiences;
			this.experiencesSummary = resourceView.experiencesSummary;
			this.profileSummary = resourceView.profileSummary;
			this.skills = resourceView.skills.map((skill: Skill) => skill.skill.name);
			this.skillsSummary = resourceView.skillsSummary;
			this.viewName = resourceView.type;

			if (resourceView.revisionType === RevisionType.PENDING) {
				this.isRevision = true;
			} else {
				this.isRevision = false;
			}
			if (profileViews) {
				this.revisionViewLoaded.emit({
					isRevision: this.isRevision,
					currentViewName: this.viewName,
					resourceViews: profileViews,
				});
			} else {
				this.revisionViewLoaded.emit({
					isRevision: this.isRevision,
					currentViewName: this.viewName,
				});
			}
		});
	}

	openRejectionDialog() {
		this.translateService
			.get(['viewResourceProfile.rejectDialog'])
			.pipe(take(1))
			.subscribe(data => {
				const rejectionDialogText = data['viewResourceProfile.rejectDialog'];
				this.modalService.open(
					{
						title: rejectionDialogText.title,
						closeText: rejectionDialogText.closeText,
						confirmText: rejectionDialogText.confirmText,
						closable: true,
						template: this.template,
						id: 'reject',
					},
					CustomModalType.CONTENT,
				);
			});

		this.modalService.confirmEventSubject.subscribe(() => {
			this.modalService.close();
			this.resourceService
				.approveOrDenyRevision(
					this.viewID,
					// eslint-disable-next-line @typescript-eslint/dot-notation
					this.viewResourceProfileForm.controls['rejectionComments'].value,
					false,
				)
				.subscribe();
			this.modalService.confirmEventSubject.unsubscribe();
			this.router.navigate(['../../manage-resources'], { relativeTo: this.route });
		});
	}

	openConfirmationDialog() {
		this.translateService
			.get(['viewResourceProfile.confirmationDialog'])
			.pipe(take(1))
			.subscribe(data => {
				const confirmationDialogText = data['viewResourceProfile.confirmationDialog'];
				this.modalService.open(
					{
						title: confirmationDialogText.title,
						confirmText: confirmationDialogText.confirmText,
						message: confirmationDialogText.message,
						modalType: ModalType.INFO,
						closable: true,
						id: 'confirm',
					},
					CustomModalType.INFO,
				);
			});

		this.modalService.confirmEventSubject.subscribe(() => {
			this.modalService.close();
			this.resourceService.approveOrDenyRevision(this.viewID, '', true).subscribe();
			this.modalService.confirmEventSubject.unsubscribe();
			this.router.navigate(['../../manage-resources'], { relativeTo: this.route });
		});
	}
}
