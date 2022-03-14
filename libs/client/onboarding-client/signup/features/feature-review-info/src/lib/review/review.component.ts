import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
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

	cols = '1';

	skillsEducationCols = '1';

	skillsChipsCols = '2';

	hideElement = false;

	displayNameMap = new Map([
		[Breakpoints.XSmall, '1'],
		[Breakpoints.Small, 'Small'],
		[Breakpoints.Medium, 'Medium'],
		[Breakpoints.Large, 'Large'],
		[Breakpoints.XLarge, 'XLarge'],
	]);

	constructor(breakpointObserver: BreakpointObserver, private router: Router, private route: ActivatedRoute) {
		breakpointObserver
			.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
			.pipe(takeUntil(this.destroyed))
			.subscribe(result => {
				for (const query of Object.keys(result.breakpoints)) {
					if (result.breakpoints[query]) {
						if (query === Breakpoints.XSmall || query === Breakpoints.Small) {
							this.cols = '2';
							this.skillsChipsCols = '1';
							this.skillsEducationCols = '3';
							this.hideElement = false;
						} else {
							this.cols = '1';
							this.skillsChipsCols = '2';
							this.skillsEducationCols = '1';
							this.hideElement = true;
						}
					}
				}
			});
	}

	formatDateRange(startDate: Date, endDate: Date): string {
		const months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		];

		const startMonth = months[startDate.getMonth()];
		const endMonth = months[startDate.getMonth()];

		return `${startMonth}. ${startDate.getFullYear()} - ${endMonth}. ${endDate.getFullYear()}`;
	}

	formatDate(startDate: Date, endDate: Date) {
		return this.formatDateRange(startDate, endDate);
	}

	backStep() {
		this.router.navigate(['../myinfothree'], { relativeTo: this.route });
	}
}
