import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Revision, View, ViewNames } from '@tempus/shared-domain';
import { OnboaringClientResourceProfileService } from '@tempus/client/onboarding-client/shared/data-access';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { LoadView } from '../LoadView.model';

@Component({
	selector: 'tempus-user-bar',
	templateUrl: './user-bar.component.html',
	styleUrls: ['./user-bar.component.scss'],
})
export class UserBarComponent implements OnChanges {
	viewNames: string[] = [];

	viewIDs: number[] = [];

	@Input()
	loadedView: LoadView = { isRevision: false };

	viewDropDownForm = this.fb.group({
		viewSelected: [''],
	});

	viewResourceProfilePrefx = 'viewResourceProfile.';

	@Output() newViewSelected = new EventEmitter<string>();

	constructor(
		private route: ActivatedRoute,
		private resourceService: OnboaringClientResourceProfileService,
		private fb: FormBuilder,
	) {}

	ngOnChanges(): void {
		if (this.loadedView.resourceViews) {
			this.viewNames = this.loadedView.resourceViews.map(view => view.type);
			this.viewIDs = this.loadedView.resourceViews.map(view => view.id);
		}
		if (this.loadedView.currentViewName) {
			this.viewDropDownForm.patchValue({
				viewSelected: this.loadedView.currentViewName,
			});
		}
	}

	onClick(optionSelected: string): void {
		const index = this.viewNames.indexOf(optionSelected);
		this.newViewSelected.emit(String(this.viewIDs[index]));
	}
}
