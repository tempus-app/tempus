import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApproveViewDto } from '@tempus/api/shared/dto';
import { APP_CONFIG } from '@tempus/app-config';
import { AppConfig, ICreateViewDto, Revision, RevisionType, View } from '@tempus/shared-domain';
import { catchError, Observable } from 'rxjs';
import { handleError } from './errorHandler';

@Injectable({ providedIn: 'root' })
export class OnboardingClientViewsService {
	constructor(private http: HttpClient, @Inject(APP_CONFIG) private appConfig: AppConfig) {}

	url = `${this.appConfig.apiUrl}/onboarding/profile-view`;

	public getViewsByStatus(
		status: RevisionType,
		page: number,
		pageSize: number,
	): Observable<{ views: View[]; totalPendingApprovals: number }> {
		return this.http
			.get<{ views: View[]; totalPendingApprovals: number }>(
				`${this.url}/views?page=${page}&pageSize=${pageSize}`,
				{
					params: {
						status,
					},
				},
			)
			.pipe(catchError(handleError));
	}

	public getViewsByResourceId(
		resourceId: number,
		page: number,
		pageSize: number,
	): Observable<{ views: View[]; totalViews: number }> {
		return this.http
			.get<{ views: View[]; totalViews: number }>(
				`${this.url}/${resourceId}?page=${page}&pageSize=${pageSize}`,
				{},
			)
			.pipe(catchError(handleError));
	}

	public getViewById(viewId: number): Observable<View> {
		return this.http.get<View>(`${this.url}/view/${viewId}`).pipe(catchError(handleError));
	}

	public editResourceView(viewId: number, newView: ICreateViewDto): Observable<Revision> {
		return this.http.patch<Revision>(`${this.url}/${viewId}`, newView).pipe(catchError(handleError));
	}

	public createSecondaryView(resourceId: number, newView: ICreateViewDto): Observable<View> {
		return this.http
			.post<View>(`${this.url}/profile-view/${resourceId}/new-view`, newView)
			.pipe(catchError(handleError));
	}

	public approveOrDenyRevision(id: number, comment: string, approval: boolean): Observable<ApproveViewDto> {
		return this.http
			.post<ApproveViewDto>(`${this.url}/profile-view/approve/${id}`, { comment, approval })
			.pipe(catchError(handleError));
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public deleteView(viewId: number): Observable<any> {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return this.http.delete<any>(`${this.url}/${viewId}`).pipe(catchError(handleError));
	}
}
