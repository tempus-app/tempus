import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, switchMap, take, map, tap, catchError, throwError, BehaviorSubject, filter, EMPTY } from 'rxjs';
import {
	logout,
	OnboardingClientAuthService,
	OnboardingClientState,
	refreshSuccess,
	selectAccessRefreshToken,
} from '@tempus/client/onboarding-client/shared/data-access';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { TokensDto } from '@tempus/shared-domain';

@Injectable({
	providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
	private isRefreshing = false;

	private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

	skipInterceptor = false;

	constructor(
		private router: Router,
		private sharedStore: Store<OnboardingClientState>,
		private authService: OnboardingClientAuthService,
	) {}

	addHeaderToReq(req: HttpRequest<any>, tokens: { accessToken: string | null; refreshToken: string | null }) {
		if (req.url.includes('refresh')) {
			req = req.clone({ headers: req.headers.set('Authorization', `Bearer ${tokens.refreshToken || ''}`) });
		} else {
			req = req.clone({ headers: req.headers.set('Authorization', `Bearer ${tokens.accessToken || ''}`) });
		}
		return req;
	}

	logout(errMsg: string): Observable<any> {
		this.isRefreshing = false;
		this.refreshTokenSubject.next(null);
		this.authService.resetSessionStorage();
		this.router.navigateByUrl('/signin');
		const err = new Error(errMsg);
		err.name = 'intercept';
		alert(errMsg);
		return throwError(() => err);
	}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const omitEndpoints = ['auth/login', './assets'];
		omitEndpoints.forEach(endpoint => {
			if (req.url.includes(endpoint)) {
				this.skipInterceptor = true;
			}
		});

		if (!this.skipInterceptor) {
			return this.sharedStore.select(selectAccessRefreshToken).pipe(
				take(1),
				switchMap(token => {
					if (token.accessToken) {
						const tokenizedReq = this.addHeaderToReq(req, token);
						return next.handle(tokenizedReq).pipe(
							catchError(err => {
								if (err instanceof HttpErrorResponse) {
									if (err.status === 401 && !err.url?.includes('auth/refresh')) {
										if (!this.isRefreshing) {
											this.isRefreshing = true;
											this.refreshTokenSubject.next(null);
											return this.authService.refresh().pipe(
												switchMap((tokenDto: TokensDto) => {
													this.sharedStore.dispatch(
														refreshSuccess({ accessToken: tokenDto.accessToken, refreshToken: tokenDto.refreshToken }),
													);
													this.refreshTokenSubject.next(tokenDto);
													this.isRefreshing = false;
													return next.handle(this.addHeaderToReq(req, tokenDto));
												}),
											);
										}
										return this.refreshTokenSubject.pipe(
											filter(newToken => newToken != null && newToken != undefined),
											take(1),
											switchMap(newToken => {
												return next.handle(this.addHeaderToReq(req, newToken));
											}),
										);
									}
									return this.logout('Session has expired, please login again');
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
