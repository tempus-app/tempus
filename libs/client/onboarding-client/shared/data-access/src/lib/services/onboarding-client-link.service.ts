import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Link } from '@tempus/shared-domain';
import { catchError, Observable } from 'rxjs';
import { handleError } from './errorHandler';

@Injectable({ providedIn: 'root' })
export class OnboardingClientLinkService {
	constructor(private http: HttpClient) {}

	url = 'http://localhost:3000/onboarding/link';

	public loadLink(linkToken: string): Observable<Link> {
		return this.http.get<Link>(`${this.url}?token=${linkToken}`).pipe(catchError(handleError));
	}
}
