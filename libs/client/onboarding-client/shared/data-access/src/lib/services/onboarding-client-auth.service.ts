/* eslint-disable class-methods-use-this */
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig, AuthDto, TokensDto } from '@tempus/shared-domain';
import { catchError, Observable, tap } from 'rxjs';
import { APP_CONFIG } from '@tempus/app-config';
import { SessionStorageKey } from '../enum';
import { handleError } from './errorHandler';

@Injectable({ providedIn: 'root' })
export class OnboardingClientAuthService {
	constructor(private http: HttpClient, @Inject(APP_CONFIG) private appConfig: AppConfig) {}

	url = `${this.appConfig.apiUrl}/onboarding/auth`;

	public login(password: string, email: string): Observable<AuthDto> {
		return this.http.post<AuthDto>(`${this.url}/login`, { password, email }).pipe(
			tap(data => {
				this.setUserDataInSessionStorage(
					data.accessToken,
					data.refreshToken,
					data.user.firstName,
					data.user.lastName,
					data.user.email,
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

	// UNUSED FOR NOW -- will need to figure out how to inject into hyrdationReducer to use this in there
	public getUserDataFromSessionStorage(): {
		accessToken: string | null;
		refreshToken: string | null;
		email: string | null;
		firstName: string | null;
		lastName: string | null;
	} {
		const accessToken: string | null = sessionStorage.getItem(SessionStorageKey.TEMPUS_ACCESS_TOKEN);
		const refreshToken: string | null = sessionStorage.getItem(SessionStorageKey.TEMPUS_REFRESH_TOKEN);
		const firstName: string | null = sessionStorage.getItem(SessionStorageKey.TEMPUS_FIRST_NAME);
		const lastName: string | null = sessionStorage.getItem(SessionStorageKey.TEMPUS_LAST_NAME);
		const email: string | null = sessionStorage.getItem(SessionStorageKey.TEMPUS_EMAIL);

		return {
			accessToken,
			refreshToken,
			firstName,
			lastName,
			email,
		};
	}

	public updateAccessAndRefreshTokenInStorage(accessToken: string, refreshToken: string) {
		sessionStorage.setItem(SessionStorageKey.TEMPUS_ACCESS_TOKEN, accessToken);
		sessionStorage.setItem(SessionStorageKey.TEMPUS_REFRESH_TOKEN, refreshToken);
	}

	public setUserDataInSessionStorage(
		accessToken: string,
		refreshToken: string,
		firstName: string,
		lastName: string,
		email: string,
	) {
		sessionStorage.setItem(SessionStorageKey.TEMPUS_ACCESS_TOKEN, accessToken);
		sessionStorage.setItem(SessionStorageKey.TEMPUS_REFRESH_TOKEN, refreshToken);
		sessionStorage.setItem(SessionStorageKey.TEMPUS_FIRST_NAME, firstName);
		sessionStorage.setItem(SessionStorageKey.TEMPUS_LAST_NAME, lastName);
		sessionStorage.setItem(SessionStorageKey.TEMPUS_EMAIL, email);
	}

	public logout() {
		return this.http.post<TokensDto>(`${this.url}/logout`, {}).pipe(catchError(handleError));
	}

	public resetSessionStorage() {
		sessionStorage.removeItem(SessionStorageKey.TEMPUS_ACCESS_TOKEN);
		sessionStorage.removeItem(SessionStorageKey.TEMPUS_FIRST_NAME);
		sessionStorage.removeItem(SessionStorageKey.TEMPUS_LAST_NAME);
		sessionStorage.removeItem(SessionStorageKey.TEMPUS_EMAIL);
		sessionStorage.removeItem(SessionStorageKey.TEMPUS_REFRESH_TOKEN);
	}
}
