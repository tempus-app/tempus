import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'tempus-upload-resume',
	templateUrl: './upload-resume.component.html',
	styleUrls: ['./upload-resume.component.scss'],
})
export class UploadResumeComponent {
	cols = '1';

	destroyed = new Subject<void>();

	rows = '5';

	constructor(breakpointObserver: BreakpointObserver) {
		breakpointObserver
			.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
			.pipe(takeUntil(this.destroyed))
			.subscribe(result => {
				for (const query of Object.keys(result.breakpoints)) {
					if (result.breakpoints[query]) {
						if (query === Breakpoints.XSmall || query === Breakpoints.Small) {
							this.rows = '8';
							this.cols = '2';
						} else {
							this.rows = '5';
							this.cols = '1';
						}
					}
				}
			});
	}
}
