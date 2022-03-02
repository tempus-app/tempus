import { Component, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InputType } from '@tempus/frontend-common';

@Component({
	selector: 'tempus-my-info-two',
	templateUrl: './my-info-two.component.html',
	styleUrls: ['./my-info-two.component.scss'],
})
export class MyInfoTwoComponent implements OnDestroy {
	destroyed = new Subject<void>();

	cols = '1';

	rows = '10';

	numberWorkSections: number[] = [0];

	hideElement = true;

	InputType = InputType;

	constructor(breakpointObserver: BreakpointObserver) {
		breakpointObserver
			.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
			.pipe(takeUntil(this.destroyed))
			.subscribe(result => {
				for (const query of Object.keys(result.breakpoints)) {
					if (result.breakpoints[query]) {
						if (query === Breakpoints.XSmall || query === Breakpoints.Small) {
							this.rows = '15';
							this.cols = '2';
							this.hideElement = false;
						} else {
							this.rows = '10';
							this.cols = '1';
							this.hideElement = true;
						}
					}
				}
			});
	}

	ngOnDestroy() {
		this.destroyed.next();
		this.destroyed.complete();
	}

	addWorkSections() {
		// Prevent duplicate numbers which can cause an error when splicing a work experience section out
		if (this.numberWorkSections.length === 0) {
			this.numberWorkSections.push(0);
		} else {
			const lastElement = this.numberWorkSections[this.numberWorkSections.length - 1];
			this.numberWorkSections.push(lastElement + 1);
		}
	}

	removeWorkSection(index: number) {
		this.numberWorkSections.splice(index, 1);
	}
}
