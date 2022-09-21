/* eslint-disable class-methods-use-this */
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig, AuthDto } from '@tempus/shared-domain';
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
					data.user.id,
					data.user.firstName,
					data.user.lastName,
					data.user.email,
				);
			}),
			catchError(handleError),
		);
	}

	// UNUSED FOR NOW -- will need to figure out how to inject into hyrdationReducer to use this in there
	public getUserDataFromSessionStorage(): {
		accessToken: string | null;
		userId: number | null;
		email: string | null;
		firstName: string | null;
		lastName: string | null;
	} {
		const accessToken: string | null = sessionStorage.getItem(SessionStorageKey.TEMPUS_ACCESS_TOKEN);
		const userIdString: string | null = sessionStorage.getItem(SessionStorageKey.TEMPUS_USER_ID);
		const userId: number | null = userIdString ? parseInt(userIdString, 10) : null;
		const firstName: string | null = sessionStorage.getItem(SessionStorageKey.TEMPUS_FIRST_NAME);
		const lastName: string | null = sessionStorage.getItem(SessionStorageKey.TEMPUS_LAST_NAME);
		const email: string | null = sessionStorage.getItem(SessionStorageKey.TEMPUS_EMAIL);

		return {
			accessToken,
			userId,
			firstName,
			lastName,
			email,
		};
	}

	public setUserDataInSessionStorage(
		accessToken: string,
		userId: number,
		firstName: string,
		lastName: string,
		email: string,
	) {
		sessionStorage.setItem(SessionStorageKey.TEMPUS_ACCESS_TOKEN, accessToken);
		sessionStorage.setItem(SessionStorageKey.TEMPUS_USER_ID, userId.toString());
		sessionStorage.setItem(SessionStorageKey.TEMPUS_FIRST_NAME, firstName);
		sessionStorage.setItem(SessionStorageKey.TEMPUS_LAST_NAME, lastName);
		sessionStorage.setItem(SessionStorageKey.TEMPUS_EMAIL, email);
	}

	public logout() {
		sessionStorage.removeItem(SessionStorageKey.TEMPUS_ACCESS_TOKEN);
		sessionStorage.removeItem(SessionStorageKey.TEMPUS_USER_ID);
		sessionStorage.removeItem(SessionStorageKey.TEMPUS_FIRST_NAME);
		sessionStorage.removeItem(SessionStorageKey.TEMPUS_LAST_NAME);
		sessionStorage.removeItem(SessionStorageKey.TEMPUS_EMAIL);
	}
}
