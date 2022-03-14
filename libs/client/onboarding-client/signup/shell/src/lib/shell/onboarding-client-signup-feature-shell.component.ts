import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
	selectAllResumeComponentsCreated,
	selectResourceData,
	SignupState,
} from '@tempus/client/onboarding-client/signup/data-access';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'tempus-signup-shell',
	templateUrl: './onboarding-client-signup-feature-shell.component.html',
	styleUrls: ['./onboarding-client-signup-feature-shell.component.scss'],
})
export class SignupShellComponent implements OnInit, OnDestroy {
	steps = ['Signup', 'Upload Resume', 'My Information 1', 'My Information 2', 'My Information 3', 'Review'];

	links = ['credentials', 'uploadresume', 'myinfoone', 'myinfotwo', 'myinfothree', 'review'];

	completed = [true, false, false, false, false, false];

	isDisabled = false;

	stepperIndex = 0;

	destroyed$ = new Subject<void>();

	navigateToStep(stepIndex: number) {
		// this.stepperIndex = stepIndex;
		// this.router.navigate([`../${this.links[this.stepperIndex]}`], { relativeTo: this.route });
	}

	constructor(private router: Router, private store: Store<SignupState>, private route: ActivatedRoute) {
		this.router.events.subscribe((event: Event) => {
			if (event instanceof NavigationEnd) {
				for (let i = 0; i < this.links.length; i += 1) {
					if (event.url.includes(this.links[i])) {
						this.stepperIndex = i;
					}
				}
			}
		});
	}

	ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	ngOnInit(): void {
		this.store
			.select(selectAllResumeComponentsCreated)
			.pipe(takeUntil(this.destroyed$))
			.subscribe(createdComponents => {
				this.completed[2] = createdComponents.userDetailsCreated;
				this.completed[3] = createdComponents.experienceCreated;
				this.completed[4] = createdComponents.trainingAndSkillsCreated;
				this.completed[5] =
					createdComponents.userDetailsCreated &&
					createdComponents.experienceCreated &&
					createdComponents.trainingAndSkillsCreated;
			});
	}
}
