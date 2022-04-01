import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Revision, View } from '@tempus/shared-domain';
import { OnboaringClientResourceProfileService } from '@tempus/client/onboarding-client/shared/data-access';
import { ActivatedRoute } from '@angular/router';
import { ButtonType } from '@tempus/client/shared/ui-components/presentational';
import { FormBuilder } from '@angular/forms';

@Component({
	selector: 'tempus-user-bar',
	templateUrl: './user-bar.component.html',
	styleUrls: ['./user-bar.component.scss'],
})
export class UserBarComponent implements OnInit {
	views: string[] = [];

	@Input()
	isRevision = false;

	viewDropDownForm = this.fb.group({
		viewSelected: [''],
	});

	constructor(
		private route: ActivatedRoute,
		private resourceService: OnboaringClientResourceProfileService,
		private fb: FormBuilder,
	) {}

	ngOnInit(): void {
		const id = this.route.snapshot.paramMap.get('id') || '';
		this.resourceService.getResourceProfileViews(id).subscribe(profileViews => {
			this.views = profileViews.map(view => view.type);
		});
	}
}
