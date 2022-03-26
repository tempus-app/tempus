import { Injectable } from '@angular/core';
import {
	ActivatedRoute,
	ActivatedRouteSnapshot,
	CanActivate,
	CanLoad,
	Route,
	Router,
	RouterStateSnapshot,
	UrlSegment,
	UrlTree,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { OnboardingClientState, selectAccessTokenAndRoles } from '@tempus/client/onboarding-client/shared/data-access';
import { RoleType } from '@tempus/shared-domain';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

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
		return this.store.select(selectAccessTokenAndRoles).pipe(
			take(1),
			map(authTokenAndRoles => {
				const curRoute = this.router.getCurrentNavigation()?.extractedUrl.toString().split('/');

				if (curRoute) {
					if (
						(curRoute[0] === 'resource' &&
							!authTokenAndRoles.roles.includes(RoleType.AVAILABLE_RESOURCE) &&
							!authTokenAndRoles.roles.includes(RoleType.ASSIGNED_RESOURCE)) ||
						(curRoute[0] === 'owner' && !authTokenAndRoles.roles.includes(RoleType.BUSINESS_OWNER))
					) {
						return this.backToSigin();
					}
					if (authTokenAndRoles.accessToken) {
						return true;
					}
				} else {
					return this.backToSigin();
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
