import { Injectable } from '@angular/core';
import { ActivatedRoute, CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectLinkData, SignupState } from '@tempus/client/onboarding-client/signup/data-access';
import { StatusType } from '@tempus/shared-domain';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ValidLinkGuard implements CanLoad {
	constructor(private store: Store<SignupState>, private router: Router, private activatedRoute: ActivatedRoute) {}

	canLoad(
		route: Route,
		segments: UrlSegment[],
	): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
		return this.store.select(selectLinkData).pipe(
			take(1),
			map(linkData => {
				if (linkData?.status === StatusType.ACTIVE) {
					return true;
				}
				const curRoute = this.router.getCurrentNavigation()?.extractedUrl.toString().split('/');
				const credentialsRoute = curRoute?.slice(0, -1);
				credentialsRoute?.push('credentials');

				this.router.navigate([credentialsRoute?.join('/')], { relativeTo: this.activatedRoute });
				return false;
			}),
		);
	}
}
