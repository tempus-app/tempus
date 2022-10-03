import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { OnboardingClientState, selectAccessToken } from '@tempus/client/onboarding-client/shared/data-access';
import { RoleType } from '@tempus/shared-domain';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { decodeJwt } from '@tempus/client/shared/util';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanLoad, CanActivate {
	constructor(
		private store: Store<OnboardingClientState>,
		private router: Router,
		private activatedRoute: ActivatedRoute,
	) {}

	backToSigin = () => {
		this.router.navigateByUrl('signin');
		return false;
	};

	// Makes sure that if you are visiting anything under /resource, you have the role of AVAIL or ASSIGNED resource
	// Makes sure that if you are visiting anything under /owner, you have the role of BUSINESS_OWNER
	authVerification = () => {
		return this.store.select(selectAccessToken).pipe(
			take(1),
			map(authToken => {
				if (!authToken) {
					return this.backToSigin();
				}

				const curRoute = this.router.getCurrentNavigation()?.extractedUrl.toString().split('/');

				const { roles } = decodeJwt(authToken || '');

				if (curRoute) {
					if (
						(curRoute[1] === 'resource' &&
							!roles.includes(RoleType.AVAILABLE_RESOURCE) &&
							!roles.includes(RoleType.ASSIGNED_RESOURCE)) ||
						(curRoute[1] === 'owner' &&
							!roles.includes(RoleType.BUSINESS_OWNER) &&
							!roles.includes(RoleType.SUPERVISOR))
					) {
						return this.backToSigin();
					}
					return true;
				}
				return this.backToSigin();
			}),
		);
	};

	canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
		return this.authVerification();
	}

	canLoad(
		route: Route,
		segments: UrlSegment[],
	): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
		return this.authVerification();
	}
}
