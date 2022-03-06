import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { formatDateRange } from '@tempus/shared/util';
import { Experience, Education } from '@tempus/shared-domain';

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

	constructor(breakpointObserver: BreakpointObserver) {
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

	formatDate(startDate: Date, endDate: Date) {
		return formatDateRange(startDate, endDate);
	}
}
