/* eslint-disable @typescript-eslint/dot-notation */
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
	logout,
	OnboardingClientState,
	selectLoggedInUserNameEmail,
} from '@tempus/client/onboarding-client/shared/data-access';
import { take } from 'rxjs';
import { UserType } from './sidebar-type-enum';
import { SidebarTab } from './sidebar-tab-enum';

@Component({
	selector: 'tempus-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
	constructor(
		private store: Store<OnboardingClientState>,
		private translateService: TranslateService,
		private router: Router,
	) {}

	@Input() userType?: UserType = undefined;

	@Input() tabs: SidebarTab[] = [];

	name = '';

	email = '';

	SidebarTab = SidebarTab;

	initials = '';

	isVisible = true;

	bugReportingURL = 'https://forms.gle/KCoBXHmK49AdgJdV9';

	currentRoute = this.router.url;

	// All routes the sidebar tabs are highlighted for
	// Base route is navigated to onclick
	paths = [
		{
			tab: SidebarTab.PRIMARY_VIEW,
			route: '/resource',
			base: true,
		},
		{
			tab: SidebarTab.MY_VIEWS,
			route: '/resource/my-views',
			base: true,
		},
		{
			tab: SidebarTab.MANAGE_RESOURCES,
			route: '/owner/manage-resources',
			base: true,
		},
		{
			tab: SidebarTab.MANAGE_RESOURCES,
			route: '/owner/view-resources',
		},
	];

	ngOnInit(): void {
		this.translateService
			.get(['sidenav'])
			.pipe(take(1))
			.subscribe(() => {
				this.setUserTabs();
				this.setPlaceholders();
			});

		this.store
			.select(selectLoggedInUserNameEmail)
			.pipe(take(1))
			.subscribe(user => {
				this.name = `${user.firstName} ${user.lastName}`;
				this.email = user.email || '';
			});

		this.getInitials(this.name);
		this.isVisible = true;
	}

	setUserTabs() {
		if (this.userType === UserType.OWNER) {
			this.tabs = [SidebarTab.MANAGE_RESOURCES, SidebarTab.PENDING_APPROVALS];
		} else {
			this.tabs = [SidebarTab.PRIMARY_VIEW, SidebarTab.MY_VIEWS, SidebarTab.MY_PROJECTS];
		}
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

	isTabSelected(tab: SidebarTab) {
		this.currentRoute = this.router.url;
		const routes = this.paths.filter(x => x.tab === tab).map(y => y.route);
		const baseRoute = this.paths.filter(x => x.tab === tab && x.base).map(y => y.route)[0];

		switch (tab) {
			// must match absolute route
			case SidebarTab.PRIMARY_VIEW:
				return this.currentRoute === baseRoute;
			default:
				for (let i = 0; i < routes.length; i++) {
					if (this.currentRoute.includes(routes[i])) {
						return true;
					}
				}
				return false;
		}
	}

	navigate(tab: SidebarTab) {
		const baseRoute = this.paths.filter(x => x.tab === tab && x.base).map(y => y.route)[0];

		switch (tab) {
			case SidebarTab.LOGOUT:
				this.store.dispatch(logout({ redirect: true }));
				break;
			case SidebarTab.REPORT_BUGS:
				this.openReportBugForm();
				break;
			default:
				this.router.navigateByUrl(baseRoute);
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
