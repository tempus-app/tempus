import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApproveViewDto } from '@tempus/api/shared/dto';
import { Resource, View, ViewNames } from '@tempus/shared-domain';
import { catchError, Observable } from 'rxjs';
import { handleError } from './errorHandler';

@Injectable({ providedIn: 'root' })
export class OnboaringClientResourceProfileService {
	constructor(private http: HttpClient) {}

	public getResourceProfileViews(id: string): Observable<Array<ViewNames>> {
		return this.http
			.get<Array<ViewNames>>(`http://localhost:3000/onboarding/profile-view/view-names/${id}`)
			.pipe(catchError(handleError));
	}

	public getResourceInformation(id: string): Observable<Resource> {
		return this.http.get<Resource>(`http://localhost:3000/onboarding/user/${id}`).pipe(catchError(handleError));
	}

	public getView(id: string): Observable<View> {
		return this.http
			.get<View>(`http://localhost:3000/onboarding/profile-view/view/${id}`)
			.pipe(catchError(handleError));
	}

	public approveOrDenyRevision(id: string, comment: string, approval: boolean): Observable<ApproveViewDto> {
		return this.http
			.post<ApproveViewDto>(`http://localhost:3000/onboarding/profile-view/approve/${id}`, { comment, approval })
			.pipe(catchError(handleError));
	}
}
