import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Revision, View } from '@tempus/shared-domain';
import { OnboaringClientResourceProfileService } from '@tempus/client/onboarding-client/shared/data-access';
import { ActivatedRoute } from '@angular/router';
import { ButtonType } from '@tempus/client/shared/ui-components/presentational';
import { FormBuilder } from '@angular/forms';
import { LoadView } from '../LoadView.model';

@Component({
	selector: 'tempus-user-bar',
	templateUrl: './user-bar.component.html',
	styleUrls: ['./user-bar.component.scss'],
})
export class UserBarComponent implements OnInit, OnChanges {
	views: string[] = [];

	@Input()
	loadedView: LoadView = { isRevision: false };

	viewDropDownForm = this.fb.group({
		viewSelected: [''],
	});

	viewResourceProfilePrefx = 'viewResourceProfile.';

	constructor(
		private route: ActivatedRoute,
		private resourceService: OnboaringClientResourceProfileService,
		private fb: FormBuilder,
	) {}

	ngOnChanges(): void {
		if (this.loadedView.viewName) {
			this.viewDropDownForm.patchValue({
				viewSelected: this.loadedView.viewName,
			});
		}
	}

	ngOnInit(): void {
		const id = this.route.snapshot.paramMap.get('id') || '';
		this.resourceService.getResourceProfileViews(id).subscribe(profileViews => {
			this.views = profileViews.map(view => view.type);
		});
	}
}
