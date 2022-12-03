/* eslint-disable @typescript-eslint/dot-notation */
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { LoadView, ProjectResource, RoleType, ViewNames } from '@tempus/shared-domain';
import { OnboardingClientResourceService } from '@tempus/client/onboarding-client/shared/data-access';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ButtonType } from '@tempus/client/shared/ui-components/presentational';
import { ModalService, ModalType, CustomModalType } from '@tempus/client/shared/ui-components/modal';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';
import { isValidRole } from '@tempus/client/shared/util';

@Component({
	selector: 'tempus-user-bar',
	templateUrl: './user-bar.component.html',
	styleUrls: ['./user-bar.component.scss'],
})
export class UserBarComponent implements OnChanges {
	@Input() loadedView: LoadView = { isRevision: false };

	@Input() resourceName = '';

	@Input() resourceEmail = '';

	@Input() resourceId = 0;

	@Input()
	projectResources: ProjectResource[] = [];

  @Input() roles: RoleType[] = [];

	viewNames: string[] = [];

	viewIDs: number[] = [];

	currentViewID = 0;

	viewDropDownForm = this.fb.group({
		viewSelected: [''],
	});

	buttonType = ButtonType;

	viewResourceProfilePrefx = 'viewResourceProfile.';

  isValidRole = isValidRole;

  roleType = RoleType;

	@Output() newViewSelected = new EventEmitter<number>();

	@Output() editViewSelected = new EventEmitter();

	constructor(
		private route: ActivatedRoute,
		private resourceService: OnboardingClientResourceService,
		private fb: FormBuilder,
		private router: Router,
		private modalService: ModalService,
		private translateService: TranslateService,
	) {
		const { currentLang } = translateService;
		// eslint-disable-next-line no-param-reassign
		translateService.currentLang = '';
		translateService.use(currentLang);
	}

	ngOnChanges(): void {
		if (this.loadedView.resourceViews) {
			this.viewNames = this.loadedView.resourceViews.map((view: ViewNames) => view.type);
			this.viewIDs = this.loadedView.resourceViews.map((view: ViewNames) => view.id);
		}
		if (this.loadedView.currentViewName) {
			this.viewDropDownForm.patchValue({
				viewSelected: this.loadedView.currentViewName,
			});
			this.currentViewID = parseInt(this.route.snapshot.queryParamMap.get('viewId') || '0', 10);
		}
	}

	downloadProfile() {
		// Taken from https://stackoverflow.com/questions/52154874/angular-6-downloading-file-from-rest-api
		this.resourceService.downloadProfile(this.currentViewID).subscribe(data => {
			const downloadURL = window.URL.createObjectURL(data);
			const link = document.createElement('a');
			link.href = downloadURL;
			const index = this.viewIDs.indexOf(this.currentViewID);
			link.download = `${this.resourceName}-${this.viewNames[index]}`;
			link.click();
		});
		this.translateService
			.get(`${this.viewResourceProfilePrefx}downloadDialog`)
			.pipe(take(1))
			.subscribe(data => {
				this.modalService.open(
					{
						title: data['title'],
						confirmText: data['confirmText'],
						message: data['message'],
						modalType: ModalType.INFO,
						closable: true,
						id: 'info',
					},
					CustomModalType.INFO,
				);
			});
	}

	onClick(optionSelected: string): void {
		const index = this.viewNames.indexOf(optionSelected);
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: { viewId: this.viewIDs[index] },
		});
		this.newViewSelected.emit(this.viewIDs[index]);
	}

	openViewForm() {
		this.router.navigate(['./new'], { relativeTo: this.route });
	}

	openEditView() {
		this.editViewSelected.emit();
	}
}
