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
				this.setUserDataInSessionStorage(data.accessToken, data.user.id);
			}),
			catchError(handleError),
		);
	}

	public getUserDataFromSessionStorage(): { accessToken: string | null; userId: number | null } {
		const accessToken: string | null = sessionStorage.getItem(SessionStorageKey.TEMPUS_ACCESS_TOKEN);
		const userIdString: string | null = sessionStorage.getItem(SessionStorageKey.TEMPUS_USER_ID);
		const userId: number | null = userIdString ? parseInt(userIdString, 10) : null;
		return {
			accessToken,
			userId,
		};
	}

	public setUserDataInSessionStorage(accessToken: string, userId: number) {
		sessionStorage.setItem('tempus_access_token', accessToken);
		sessionStorage.setItem('tempus_user_id', userId.toString());
	}

	public logout() {
		sessionStorage.clear();
	}
}
