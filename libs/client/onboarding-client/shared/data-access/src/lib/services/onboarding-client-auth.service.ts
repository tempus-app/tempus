/* eslint-disable class-methods-use-this */
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig, AuthDto, ResetPasswordDto, TokensDto } from '@tempus/shared-domain';
import { catchError, Observable, tap } from 'rxjs';
import { APP_CONFIG } from '@tempus/app-config';
import { SessionStorageKey } from '../enum';
import { handleError } from './errorHandler';
import { decodeJwt } from '@tempus/client/shared/util';

@Injectable({ providedIn: 'root' })
export class OnboardingClientAuthService {
	constructor(private http: HttpClient, @Inject(APP_CONFIG) private appConfig: AppConfig) {}

	url = `${this.appConfig.apiUrl}/onboarding/auth`;

	public login(password: string, email: string): Observable<AuthDto> {
		return this.http.post<AuthDto>(`${this.url}/login`, { password, email }).pipe(
			tap(data => {
        const { roles } = decodeJwt(data.accessToken || '');
				this.setUserDataInSessionStorage(
					data.accessToken,
					data.refreshToken,
					data.user.id,
					data.user.firstName,
					data.user.lastName,
					data.user.email,
          roles
				);
			}),
			catchError(handleError),
		);
	}

	public refresh(): Observable<TokensDto> {
		return this.http.post<TokensDto>(`${this.url}/refresh`, {}).pipe(
			tap(data => {
				this.updateAccessAndRefreshTokenInStorage(data.accessToken, data.refreshToken);
			}),
			catchError(handleError),
		);
	}

	public forgotPassword(email: string): Observable<void> {
		return this.http.post<void>(`${this.url}/forgot-password?email=${email}`, {}).pipe(catchError(handleError));
	}

	public resetPassword(resetPasswordDto: ResetPasswordDto): Observable<void> {
		return this.http.post<void>(`${this.url}/reset-password`, resetPasswordDto).pipe(catchError(handleError));
	}

	public updateAccessAndRefreshTokenInStorage(accessToken: string, refreshToken: string) {
    const { roles } = decodeJwt(accessToken || '');
		sessionStorage.setItem(SessionStorageKey.TEMPUS_ACCESS_TOKEN, accessToken);
		sessionStorage.setItem(SessionStorageKey.TEMPUS_REFRESH_TOKEN, refreshToken);
    sessionStorage.setItem(SessionStorageKey.TEMPUS_ROLES, JSON.stringify(roles));
	}

	public setUserDataInSessionStorage(
		accessToken: string,
		refreshToken: string,
		userId: number,
		firstName: string,
		lastName: string,
		email: string,
    roles: string[]
	) {
		sessionStorage.setItem(SessionStorageKey.TEMPUS_ACCESS_TOKEN, accessToken);
		sessionStorage.setItem(SessionStorageKey.TEMPUS_REFRESH_TOKEN, refreshToken);
		sessionStorage.setItem(SessionStorageKey.TEMPUS_USER_ID, userId.toString());
		sessionStorage.setItem(SessionStorageKey.TEMPUS_FIRST_NAME, firstName);
		sessionStorage.setItem(SessionStorageKey.TEMPUS_LAST_NAME, lastName);
		sessionStorage.setItem(SessionStorageKey.TEMPUS_EMAIL, email);
    sessionStorage.setItem(SessionStorageKey.TEMPUS_ROLES, JSON.stringify(roles));
	}

	public logout() {
		return this.http.post<TokensDto>(`${this.url}/logout`, {}).pipe(catchError(handleError));
	}

	public resetSessionStorage() {
		sessionStorage.removeItem(SessionStorageKey.TEMPUS_ACCESS_TOKEN);
		sessionStorage.removeItem(SessionStorageKey.TEMPUS_USER_ID);
		sessionStorage.removeItem(SessionStorageKey.TEMPUS_FIRST_NAME);
		sessionStorage.removeItem(SessionStorageKey.TEMPUS_LAST_NAME);
		sessionStorage.removeItem(SessionStorageKey.TEMPUS_EMAIL);
		sessionStorage.removeItem(SessionStorageKey.TEMPUS_REFRESH_TOKEN);
    sessionStorage.removeItem(SessionStorageKey.TEMPUS_ROLES);
	}
}
