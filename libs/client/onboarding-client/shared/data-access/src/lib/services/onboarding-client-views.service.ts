import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '@tempus/app-config';
import { AppConfig, RevisionType, View } from '@tempus/shared-domain';
import { catchError, Observable } from 'rxjs';
import { handleError } from './errorHandler';

@Injectable({ providedIn: 'root' })
export class OnboardingClientViewsService {
	constructor(private http: HttpClient, @Inject(APP_CONFIG) private appConfig: AppConfig) {}

	url = `${this.appConfig.apiUrl}/onboarding/profile-view`;

	public getViewsByStatus(status: RevisionType): Observable<View[]> {
		return this.http
			.get<View[]>(`${this.url}/views`, {
				params: {
					status,
				},
			})
			.pipe(catchError(handleError));
	}
}
