import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig, ICreateLinkDto, Link } from '@tempus/shared-domain';
import { APP_CONFIG } from '@tempus/app-config';
import { catchError, Observable } from 'rxjs';
import { handleError } from './errorHandler';

@Injectable({ providedIn: 'root' })
export class OnboardingClientLinkService {
	constructor(private http: HttpClient, @Inject(APP_CONFIG) private appConfig: AppConfig) {}

	url = `${this.appConfig.apiUrl}/onboarding/link`;

	public loadLink(linkToken: string): Observable<Link> {
		return this.http.get<Link>(`${this.url}?token=${linkToken}`).pipe(catchError(handleError));
	}

	public createLink(createLinkDto: ICreateLinkDto): Observable<Link> {
		return this.http.post<Link>(`${this.url}`, createLinkDto).pipe(catchError(handleError));
	}
}
