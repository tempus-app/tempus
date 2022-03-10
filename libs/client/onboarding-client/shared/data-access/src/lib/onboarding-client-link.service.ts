import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Link } from '@tempus/shared-domain';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OnboardingClientLinkService {
	constructor(private http: HttpClient) {}

	url = 'http://localhost:3000/onboarding/';

	public loadLink(linkId: string): Observable<Link> {
		return this.http.get<Link>(`${this.url}/${linkId}`);
	}
}
