import { Injectable } from '@angular/core';
import { ActivatedRoute, CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { OnboardingClientState, selectAccessToken } from '@tempus/client/onboarding-client/shared/data-access';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanLoad {
	constructor(
		private store: Store<OnboardingClientState>,
		private router: Router,
		private activatedRoute: ActivatedRoute,
	) {}

	canLoad(
		route: Route,
		segments: UrlSegment[],
	): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
		return this.store.select(selectAccessToken).pipe(
			take(1),
			map(authtoken => {
				if (authtoken) {
					return true;
				}
				this.router.navigateByUrl('resource/signin');
				return false;
			}),
		);
	}
}
