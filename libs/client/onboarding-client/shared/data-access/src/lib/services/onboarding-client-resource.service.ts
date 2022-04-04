import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ApproveViewDto } from '@tempus/api/shared/dto';
import {
	ICreateResourceDto,
	ICreateViewDto,
	IUserProjClientDto,
	Resource,
	Revision,
	View,
} from '@tempus/shared-domain';
import { catchError, Observable, take, switchMap } from 'rxjs';
import { OnboardingClientState, selectAccessToken } from '../+state';
import { handleError } from './errorHandler';
import { getAuthHeaders } from './service.common';

@Injectable({ providedIn: 'root' })
export class OnboardingClientResourceService {
	constructor(private http: HttpClient, private authStore: Store<OnboardingClientState>) {}

	url = 'http://localhost:3000/onboarding/user';

	public createResource(createResourceDto: ICreateResourceDto): Observable<Resource> {
		return this.http.post<Resource>(`${this.url}/resource`, createResourceDto);
	}

	public getResProjClientData(): Observable<IUserProjClientDto[]> {
		return this.authStore.select(selectAccessToken).pipe(
			take(1),
			switchMap((token: string | null) => {
				const httpAuthHeaders = getAuthHeaders(token || '');
				return this.http.get<IUserProjClientDto[]>(`${this.url}/basic`, httpAuthHeaders).pipe(catchError(handleError));
			}),
		);
	}

	public getResourceInformation(): Observable<Resource> {
		return this.authStore.select(selectAccessToken).pipe(
			take(1),
			switchMap((token: string | null) => {
				const httpAuthHeaders = getAuthHeaders(token || '');
				return this.http
					.get<Resource>(`http://localhost:3000/onboarding/user/user`, httpAuthHeaders)
					.pipe(catchError(handleError));
			}),
		);
	}

	public getResourceInformationById(resourceId: number): Observable<Resource> {
		return this.authStore.select(selectAccessToken).pipe(
			take(1),
			switchMap((token: string | null) => {
				const httpAuthHeaders = getAuthHeaders(token || '');
				return this.http
					.get<Resource>(`http://localhost:3000/onboarding/user/${resourceId}`, httpAuthHeaders)
					.pipe(catchError(handleError));
			}),
		);
	}

	public getViewById(viewId: number): Observable<View> {
		return this.authStore.select(selectAccessToken).pipe(
			take(1),
			switchMap((token: string | null) => {
				const httpAuthHeaders = getAuthHeaders(token || '');
				return this.http
					.get<View>(`http://localhost:3000/profile-view/view/${viewId}`, httpAuthHeaders)
					.pipe(catchError(handleError));
			}),
		);
	}

	// Get latest updated primary view by resource
	public getLatestPrimaryView(resourceId: number): Observable<View> {
		return this.getResourceProfileViews(resourceId).pipe(
			take(1),
			switchMap(views =>
				views
					.filter(view => view.viewType === 'PRIMARY')
					.sort((a, b) =>
						a.lastUpdateDate && b.lastUpdateDate
							? a.lastUpdateDate.getTime() > b.lastUpdateDate.getTime()
								? -1
								: 1
							: a.createdAt.getTime() > b.createdAt.getTime()
							? -1
							: 1,
					),
			),
		);
	}

	public getResourceProfileViews(resourceId: number): Observable<Array<View>> {
		return this.authStore.select(selectAccessToken).pipe(
			take(1),
			switchMap((token: string | null) => {
				const httpAuthHeaders = getAuthHeaders(token || '');
				return this.http
					.get<Array<View>>(`http://localhost:3000/onboarding/profile-view/${resourceId}`, httpAuthHeaders)
					.pipe(catchError(handleError));
			}),
		);
	}

	public editResourceView(viewId: number, newView: ICreateViewDto): Observable<Revision> {
		return this.authStore.select(selectAccessToken).pipe(
			take(1),
			switchMap((token: string | null) => {
				const httpAuthHeaders = getAuthHeaders(token || '');
				return this.http
					.patch<Revision>(`http://localhost:3000/onboarding/profile-view/${viewId}`, newView, httpAuthHeaders)
					.pipe(catchError(handleError));
			}),
		);
	}

	public downloadProfile(id: number): Observable<Blob> {
		return this.authStore.select(selectAccessToken).pipe(
			take(1),
			switchMap(resData => {
				const httpOptions = {
					responseType: 'blob' as 'json',
					headers: new HttpHeaders({
						Authorization: `Bearer ${resData}`,
					}),
				};
				return this.http.get<Blob>(`http://localhost:3000/onboarding/profile-view/download-resume/${id}`, httpOptions);
			}),
		);
	}

	public approveOrDenyRevision(id: number, comment: string, approval: boolean): Observable<ApproveViewDto> {
		return this.authStore.select(selectAccessToken).pipe(
			take(1),
			switchMap(token => {
				const httpAuthHeaders = getAuthHeaders(token || '');
				return this.http
					.post<ApproveViewDto>(
						`http://localhost:3000/onboarding/profile-view/approve/${id}`,
						{ comment, approval },
						httpAuthHeaders,
					)
					.pipe(catchError(handleError));
			}),
		);
	}
}
