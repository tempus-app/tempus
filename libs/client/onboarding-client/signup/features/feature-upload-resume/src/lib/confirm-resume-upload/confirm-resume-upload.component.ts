import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
	selector: 'tempus-confirm-resume-upload',
	templateUrl: './confirm-resume-upload.component.html',
	styleUrls: ['./confirm-resume-upload.component.scss'],
})
export class ConfirmResumeUploadComponent implements OnDestroy {
	@Input()
	file: File | undefined;

	@Output()
	confirmDeleteSelected = new EventEmitter();

	destroyed$ = new Subject<void>();

	colsButton = '1';

	colsText = '3';

	constructor(breakpointObserver: BreakpointObserver) {
		breakpointObserver
			.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
			.pipe(takeUntil(this.destroyed$))
			.subscribe(result => {
				for (const query of Object.keys(result.breakpoints)) {
					if (result.breakpoints[query]) {
						if (query === Breakpoints.XSmall) {
							this.colsButton = '4';
							this.colsText = '4';
						} else {
							this.colsButton = '1';
							this.colsText = '3';
						}
					}
				}
			});
	}

	ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	onDeleteSelect() {
		this.confirmDeleteSelected.emit();
	}
}
