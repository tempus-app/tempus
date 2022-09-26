/* eslint-disable @typescript-eslint/dot-notation */
import { Component, Input, Output, OnInit, EventEmitter, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { logout, OnboardingClientState } from '@tempus/client/onboarding-client/shared/data-access';
import { take } from 'rxjs';
import { UserType } from './sidebar-type-enum';

@Component({
	selector: 'tempus-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
	@Input() userType?: UserType = undefined;

	@Input() tabs: string[] = [];

	@Input() name = '';

	@Input() email = '';

	@Output() selectTab = new EventEmitter();

	initials = '';

	isVisible = true;

	bugReportingURL = 'https://forms.gle/KCoBXHmK49AdgJdV9';

	ngOnInit(): void {
		this.translateService
			.get(['sidenav'])
			.pipe(take(1))
			.subscribe(() => {
				this.setUserTabs();
				this.setPlaceholders();
			});
		this.getInitials(this.name);
		this.isVisible = true;
	}

	constructor(
		private translateService: TranslateService,
		private store: Store<OnboardingClientState>,
		private router: Router,
	) {}

	setUserTabs() {
		this.translateService
			.get(['sidenav.tabs'])
			.pipe(take(1))
			.subscribe(data => {
				const sidenavtabs = data['sidenav.tabs'];
				if (this.userType === UserType.OWNER) {
					this.tabs = [sidenavtabs.manageResources, sidenavtabs.pendingApprovals];
				} else if (this.userType === UserType.RESOURCE) {
					this.tabs = [sidenavtabs.primaryView, sidenavtabs.myViews, sidenavtabs.myProjects];
				}
			});
	}

	setPlaceholders() {
		this.translateService
			.get(['sidenav.namePlaceholder', 'sidenav.emailPlaceholder', 'sidenav.logout'])
			.pipe(take(1))
			.subscribe(data => {
				if (this.name === '') this.name = data['sidenav.namePlaceholder'];
				if (this.email === '') this.email = data['sidenav.emailPlaceholder'];
			});
	}

	selectedTab(tab: string) {
		if (tab === 'logout') {
			this.store.dispatch(logout({ redirect: true }));
		}
		this.selectTab.emit(tab);
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['name'].currentValue !== changes['name'].previousValue) {
			this.getInitials(changes['name'].currentValue);
		}
	}

	getInitials(name: string) {
		const fullName = name.split(' ');
		const firstInitial = fullName[0].charAt(0);
		const secondInitial = fullName.pop()?.charAt(0);
		this.initials = firstInitial && secondInitial ? (firstInitial + secondInitial).toUpperCase() : firstInitial;
	}

	toggleSidebar() {
		this.isVisible = !this.isVisible;
	}

	openReportBugForm() {
		window.open(this.bugReportingURL, '_blank');
	}
}
