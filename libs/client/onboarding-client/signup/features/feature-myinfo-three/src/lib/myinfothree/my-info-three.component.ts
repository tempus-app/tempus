import { Component, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InputType } from '@tempus/client/shared/ui-components/input';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

export interface Fruit {
	name: string;
}

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

	constructor(breakpointObserver: BreakpointObserver) {
		breakpointObserver
			.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
			.pipe(takeUntil(this.destroyed))
			.subscribe(result => {
				for (const query of Object.keys(result.breakpoints)) {
					if (result.breakpoints[query]) {
						if (query === Breakpoints.XSmall || query === Breakpoints.Small) {
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

	addSkill(event: MatChipInputEvent): void {
		const value = (event.value || '').trim().substring(0, 50);

		if (value) {
			this.skills.push(value);
		}
		event.chipInput!.clear();
	}

	removeSkill(skill: string): void {
		const index = this.skills.indexOf(skill);

		if (index >= 0) {
			this.skills.splice(index, 1);
		}
	}
}
