import { Component, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InputType } from '@tempus/client/shared/ui-components/input';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
	selector: 'tempus-my-info-three',
	templateUrl: './my-info-three.component.html',
	styleUrls: ['./my-info-three.component.scss'],
})
export class MyInfoThreeComponent implements OnDestroy {
	destroyed = new Subject<void>();

	cols = '1';

	fieldSpacing = '1';

	rows = '12';

	InputType = InputType;

	addOnBlur = true;

	readonly separatorKeysCodes = [ENTER, COMMA] as const;

	skills: string[] = [];

	numberEducationSections: number[] = [0];

	constructor(breakpointObserver: BreakpointObserver) {
		breakpointObserver
			.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
			.pipe(takeUntil(this.destroyed))
			.subscribe(result => {
				for (const query of Object.keys(result.breakpoints)) {
					if (result.breakpoints[query]) {
						if (query === Breakpoints.XSmall) {
							this.rows = '12';
							this.cols = '2';
							this.fieldSpacing = '0';
						} else {
							this.rows = '8';
							this.cols = '1';
							this.fieldSpacing = '1';
						}
					}
				}
			});
	}

	ngOnDestroy() {
		this.destroyed.next();
		this.destroyed.complete();
	}

	addEducationSections() {
		// Prevent duplicate numbers which can cause an error when splicing a work experience section out
		if (this.numberEducationSections.length === 0) {
			this.numberEducationSections.push(0);
		} else {
			const lastElement = this.numberEducationSections[this.numberEducationSections.length - 1];
			this.numberEducationSections.push(lastElement + 1);
		}
	}

	removeEducationSection(index: number) {
		if (this.numberEducationSections.length > 1) {
			this.numberEducationSections.splice(index, 1);
		}
	}

	addSkill(event: MatChipInputEvent): void {
		const value = (event.value || '').trim().substring(0, 50);

		if (value) {
			this.skills.push(value);
		}
		if (event.chipInput !== undefined) {
			event.chipInput.clear();
		}
	}

	removeSkill(skill: string): void {
		const index = this.skills.indexOf(skill);

		if (index >= 0) {
			this.skills.splice(index, 1);
		}
	}
}
