import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { formatDateRange } from '@tempus/shared/util';
import { Experience, Education } from '@tempus/shared-domain';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'tempus-review',
	templateUrl: './review.component.html',
	styleUrls: ['./review.component.scss'],
})
export class ReviewComponent {
	name = '';

	email = '';

	country = '';

	state = '';

	city = '';

	workExperienceSummary: Array<Experience> = [];

	educationSummary: Array<Education> = [];

	skills = [];

	destroyed = new Subject<void>();

	constructor(private router: Router, private route: ActivatedRoute) {}

	formatDate(startDate: Date, endDate: Date) {
		return formatDateRange(startDate, endDate);
	}

	backStep() {
		this.router.navigate(['../myinfothree'], { relativeTo: this.route });
	}

	submit() {}
}
