import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Revision, View } from '@tempus/shared-domain';
import { OnboaringClientResourceProfileService } from '@tempus/client/onboarding-client/shared/data-access';
import { ActivatedRoute } from '@angular/router';
import { ButtonType } from '@tempus/client/shared/ui-components/presentational';

@Component({
	selector: 'tempus-user-bar',
	templateUrl: './user-bar.component.html',
	styleUrls: ['./user-bar.component.scss'],
})
export class UserBarComponent implements OnInit {
	views: string[] = [];

	@Output() dropDownClicked = new EventEmitter<View>();

	profileViews: View[] = [];

	id = '';

	revision: Revision[] | undefined;

	constructor(private route: ActivatedRoute, private resourceService: OnboaringClientResourceProfileService) {}

	ngOnInit(): void {
		this.id = this.route.snapshot.paramMap.get('id') || '';
		this.resourceService.getResourceProfileViews(this.id).subscribe(profileViews => {
			this.views = profileViews.map(view => view.viewType);
			this.profileViews = profileViews;
		});
	}

	onClick(optionSelected: string): void {
		const filteredView = this.profileViews.find(view => view.viewType === optionSelected);
		this.revision = filteredView?.status;
		this.dropDownClicked.emit(filteredView);
	}
}
