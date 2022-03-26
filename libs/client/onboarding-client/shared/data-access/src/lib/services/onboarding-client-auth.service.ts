import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthDto, Link } from '@tempus/shared-domain';
import { catchError, Observable, of, tap } from 'rxjs';
import { SessionStorageKey } from '../enum';
import { handleError } from './errorHandler';

@Injectable({ providedIn: 'root' })
export class OnboardingClientAuthService {
	constructor(private http: HttpClient) {}

	url = 'http://localhost:3000/onboarding/auth';

	public login(password: string, email: string): Observable<AuthDto> {
		return this.http.post<AuthDto>(`${this.url}/login`, { password, email }).pipe(
			tap(data => {
				this.setUserDataInSessionStorage(data.accessToken, data.user.id, data.user.roles);
			}),
			catchError(handleError),
		);
	}

	// UNUSED FOR NOW -- will need to figure out how to inject into hyrdationReducer to use this in there
	public getUserDataFromSessionStorage(): { accessToken: string | null; userId: number | null; rolesArr: string[] } {
		const accessToken: string | null = sessionStorage.getItem(SessionStorageKey.TEMPUS_ACCESS_TOKEN);
		const userIdString: string | null = sessionStorage.getItem(SessionStorageKey.TEMPUS_USER_ID);
		const roles: string | null = sessionStorage.getItem(SessionStorageKey.TEMPUS_USER_ROLES);
		const rolesArr = roles ? JSON.parse(roles) : [];
		const userId: number | null = userIdString ? parseInt(userIdString, 10) : null;
		return {
			accessToken,
			userId,
			rolesArr,
		};
	}

	public setUserDataInSessionStorage(accessToken: string, userId: number, userRoles: string[]) {
		sessionStorage.setItem(SessionStorageKey.TEMPUS_ACCESS_TOKEN, accessToken);
		sessionStorage.setItem(SessionStorageKey.TEMPUS_USER_ID, userId.toString());
		sessionStorage.setItem(SessionStorageKey.TEMPUS_USER_ROLES, JSON.stringify(userRoles));
	}

	public logout() {
		sessionStorage.removeItem(SessionStorageKey.TEMPUS_ACCESS_TOKEN);
		sessionStorage.removeItem(SessionStorageKey.TEMPUS_USER_ID);
		sessionStorage.removeItem(SessionStorageKey.TEMPUS_USER_ROLES);
	}
}
