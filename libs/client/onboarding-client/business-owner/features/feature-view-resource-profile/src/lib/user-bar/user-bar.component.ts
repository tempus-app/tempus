import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { View } from '@tempus/shared-domain';
import { OnboaringClientResourceProfileService } from '@tempus/client/onboarding-client/shared/data-access';
import { ActivatedRoute } from '@angular/router';

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
		this.dropDownClicked.emit(filteredView);
	}
}
