import { Injectable } from '@angular/core';
import {
	ActivatedRoute,
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
	UrlTree,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { selectLinkData, SignupState } from '@tempus/client/onboarding-client/signup/data-access';
import { StatusType } from '@tempus/shared-domain';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class ValidLinkGuard implements CanActivate {
	constructor(private store: Store<SignupState>, private router: Router, private route: ActivatedRoute) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
		return this.store.select(selectLinkData).pipe(
			take(1),
			map(linkData => {
				if (linkData.status === StatusType.ACTIVE) {
					return true;
				}
				this.router.navigate(['../credentials'], { relativeTo: this.route });
				return true;
			}),
		);
	}
}
