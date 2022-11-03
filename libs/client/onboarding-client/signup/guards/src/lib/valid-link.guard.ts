import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, CanLoad, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectLinkData, SignupState } from '@tempus/client/onboarding-client/signup/data-access';
import { StatusType } from '@tempus/shared-domain';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ValidLinkGuard implements CanLoad, CanActivate {
	constructor(private store: Store<SignupState>, private router: Router, private activatedRoute: ActivatedRoute) {}

	validLink = () => {
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
	};

	canActivate(): boolean | Promise<boolean> | Observable<boolean> {
		return this.validLink();
	}

	canLoad(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
		return this.validLink();
	}
}
