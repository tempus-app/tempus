import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, switchMap, take, catchError, throwError, BehaviorSubject, filter } from 'rxjs';
import {
	OnboardingClientAuthService,
	OnboardingClientState,
	refreshSuccess,
	selectAccessRefreshToken,
} from '@tempus/client/onboarding-client/shared/data-access';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ErorType, TokensDto } from '@tempus/shared-domain';

@Injectable({
	providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
	private isRefreshing = false;

	// To allow caching of requests, and reexecution post access token being refreshed
	private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

	skipInterceptor = false;

	constructor(
		private router: Router,
		private sharedStore: Store<OnboardingClientState>,
		private authService: OnboardingClientAuthService,
	) {}

	// Clone req with additional headers (access token for most request, refresh token for refresh request)
	addHeaderToReq(req: HttpRequest<any>, tokens: { accessToken: string | null; refreshToken: string | null }) {
		if (req.url.includes('refresh')) {
			req = req.clone({ headers: req.headers.set('Authorization', `Bearer ${tokens.refreshToken || ''}`) });
		} else {
			req = req.clone({ headers: req.headers.set('Authorization', `Bearer ${tokens.accessToken || ''}`) });
		}
		return req;
	}

	// Route back to signin and reset tokens in storage
	logout(errMsg: string): Observable<any> {
		this.isRefreshing = false;
		this.refreshTokenSubject.next(null);
		this.authService.resetSessionStorage();
		this.router.navigateByUrl('/signin');
		const err = new Error(errMsg);
		err.name = ErorType.INTERCEPTOR;
		alert(errMsg);
		return throwError(() => err);
	}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// Any endpoints which are not expected to involve access tokens should be added to omitted endpoints
		const omitEndpoints = ['auth/login', './assets', 'onboarding/link', 'python-api/parse', 'onboarding/user/resource'];
		omitEndpoints.forEach(endpoint => {
			if (req.url.includes(endpoint)) {
				this.skipInterceptor = true;
			}
		});

		// Saving resume does not need access token
		if (req.method === 'PATCH' && req.url.includes('resume')) {
			this.skipInterceptor = true;
		}

		// Modify headers to add access bearer token before being sent out to server
		if (!this.skipInterceptor) {
			return this.sharedStore.select(selectAccessRefreshToken).pipe(
				take(1),
				switchMap(token => {
					if (token.accessToken) {
						const tokenizedReq = this.addHeaderToReq(req, token);
						return next.handle(tokenizedReq).pipe(
							catchError(err => {
								if (err instanceof HttpErrorResponse) {
									// Technically refresh request will go through this interceptor as well
									// if error on refresh request, then refresh expired
									if (err.status === 401 && !err.url?.includes('auth/refresh')) {
										// First request discovering acces token expired, send out refresh request to refresh tokens
										if (!this.isRefreshing) {
											this.isRefreshing = true;
											this.refreshTokenSubject.next(null);
											return this.authService.refresh().pipe(
												switchMap((tokenDto: TokensDto) => {
													// update store with new tokens
													this.sharedStore.dispatch(
														refreshSuccess({ accessToken: tokenDto.accessToken, refreshToken: tokenDto.refreshToken }),
													);
													this.refreshTokenSubject.next(tokenDto);
													this.isRefreshing = false;
													return next.handle(this.addHeaderToReq(req, tokenDto));
												}),
											);
										}

										// Rerun cached requests that failed after first req discovered token expired
										return this.refreshTokenSubject.pipe(
											filter(newToken => newToken != null && newToken != undefined),
											take(1),
											switchMap(newToken => {
												return next.handle(this.addHeaderToReq(req, newToken));
											}),
										);
									}
									if (err.status === 401) {
										// Refresh token error, i.e expired
										return this.logout('Session has expired, please login again');
									} // Non authorization related error
									return throwError(() => err);
								}
								return this.logout('Unexpected error has occured');
							}),
						);
					}
					return this.logout('Unexpected error has occured');
				}),
			);
		}
		this.skipInterceptor = false;
		return next.handle(req);
	}
}
