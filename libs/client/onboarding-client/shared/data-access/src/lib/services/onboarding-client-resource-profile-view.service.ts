import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resource, View } from '@tempus/shared-domain';
import { catchError, Observable } from 'rxjs';
import { handleError } from './errorHandler';

@Injectable({ providedIn: 'root' })
export class OnboaringClientResourceProfileService {
	constructor(private http: HttpClient) {}

	public getResourceProfileViews(id: string): Observable<Array<View>> {
		return this.http
			.get<Array<View>>(`http://localhost:3000/onboarding/profile-view/${id}`)
			.pipe(catchError(handleError));
	}

	public getResourceInformation(id: string): Observable<Resource> {
		return this.http.get<Resource>(`http://localhost:3000/onboarding/user/${id}`).pipe(catchError(handleError));
	}
}
