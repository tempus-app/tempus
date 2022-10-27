/* eslint-disable @typescript-eslint/dot-notation */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
	logout,
	OnboardingClientState,
	selectAccessToken,
	selectLoggedInUserNameEmail,
} from '@tempus/client/onboarding-client/shared/data-access';
import { Subject, take, takeUntil } from 'rxjs';
import { RoleType } from '@tempus/shared-domain';
import { decodeJwt } from '@tempus/client/shared/util';
import { SidebarTab } from './sidebar-tab-enum';

@Component({
	selector: 'tempus-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
	constructor(
		private store: Store<OnboardingClientState>,
		private translateService: TranslateService,
		private router: Router,
	) {}

	@Input() tabs: SidebarTab[] = [];

	firstName = '';

	lastName = '';

	fullName = '';

	email = '';

	SidebarTab = SidebarTab;

	initials = '';

	isVisible = true;

	bugReportingURL = 'https://forms.gle/KCoBXHmK49AdgJdV9';

	currentRoute = this.router.url;

	destroyed$ = new Subject<void>();

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
		{
			tab: SidebarTab.PERSONAL_INFORMATION,
			route: '/resource/personal-information',
			base: true,
		},
	];

	ngOnInit(): void {
		this.translateService
			.get(['sidenav'])
			.pipe(take(1))
			.subscribe(() => {
				this.setPlaceholders();
			});

		this.store
			.select(selectAccessToken)
			.pipe(takeUntil(this.destroyed$))
			.subscribe(token => {
				const { roles } = decodeJwt(token || '');

				if (roles.includes(RoleType.BUSINESS_OWNER) || roles.includes(RoleType.SUPERVISOR)) {
					this.tabs = [SidebarTab.MANAGE_RESOURCES, SidebarTab.PENDING_APPROVALS];
				} else if (roles.includes(RoleType.AVAILABLE_RESOURCE) || roles.includes(RoleType.ASSIGNED_RESOURCE)) {
					this.tabs = [
						SidebarTab.PRIMARY_VIEW,
						SidebarTab.MY_VIEWS,
						SidebarTab.MY_PROJECTS,
						SidebarTab.PERSONAL_INFORMATION,
					];
				}
			});

		this.store
			.select(selectLoggedInUserNameEmail)
			.pipe(take(1))
			.subscribe(user => {
				this.firstName = user.firstName || '';
				this.lastName = user.lastName || '';
				this.fullName = `${user.firstName} ${user.lastName}`;
				this.email = user.email || '';
			});

		this.getInitials();
		this.isVisible = true;
	}

	setPlaceholders() {
		this.translateService
			.get(['sidenav.namePlaceholder', 'sidenav.emailPlaceholder', 'sidenav.logout'])
			.pipe(take(1))
			.subscribe(data => {
				if (this.fullName === '') this.fullName = data['sidenav.namePlaceholder'];
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

	getInitials() {
		this.initials = (this.firstName.charAt(0) + this.lastName.charAt(0)).toUpperCase();
	}

	toggleSidebar() {
		this.isVisible = !this.isVisible;
	}

	openReportBugForm() {
		window.open(this.bugReportingURL, '_blank');
	}

	ngOnDestroy() {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
