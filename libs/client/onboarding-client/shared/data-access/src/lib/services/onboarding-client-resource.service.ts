import { A } from '@angular/cdk/keycodes';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ICreateResourceDto, ICreateViewDto, Resource, Revision, View } from '@tempus/shared-domain';
import { catchError, Observable, take, switchMap } from 'rxjs';
import { OnboardingClientState, selectAccessToken } from '../+state';
import { handleError } from './errorHandler';

@Injectable({ providedIn: 'root' })
export class OnboardingClientResourceService {
	constructor(private http: HttpClient, private store: Store<OnboardingClientState>) {}

	url = 'http://localhost:3000/onboarding/user';

	public createResource(createResourceDto: ICreateResourceDto): Observable<Resource> {
		return this.http.post<Resource>(`${this.url}/resource`, createResourceDto);
	}

	public getResourceInformation(): Observable<Resource> {
		return this.store.select(selectAccessToken).pipe(
			take(1),
			switchMap(resData => {
				const httpOptions = {
					headers: new HttpHeaders({
						Authorization: `Bearer ${resData}`,
					}),
				};
				return this.http
					.get<Resource>(`http://localhost:3000/onboarding/user/user`, httpOptions)
					.pipe(catchError(handleError));
			}),
		);
	}

	public getViewById(viewId: number): Observable<View> {
		return this.store.select(selectAccessToken).pipe(
			take(1),
			switchMap(resData => {
				const httpOptions = {
					headers: new HttpHeaders({
						Authorization: `Bearer ${resData}`,
					}),
				};
				return this.http
					.get<View>(`http://localhost:3000/profile-view/view/${viewId}`, httpOptions)
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
		return this.store.select(selectAccessToken).pipe(
			take(1),
			switchMap(resData => {
				const httpOptions = {
					headers: new HttpHeaders({
						Authorization: `Bearer ${resData}`,
					}),
				};
				return this.http
					.get<Array<View>>(`http://localhost:3000/onboarding/profile-view/${resourceId}`, httpOptions)
					.pipe(catchError(handleError));
			}),
		);
	}

	public editResourceView(viewId: number, newView: ICreateViewDto): Observable<Revision> {
		return this.store.select(selectAccessToken).pipe(
			take(1),
			switchMap(resData => {
				const httpOptions = {
					headers: new HttpHeaders({
						Authorization: `Bearer ${resData}`,
					}),
				};
				return this.http
					.patch<Revision>(`http://localhost:3000/onboarding/profile-view/${viewId}`, newView, httpOptions)
					.pipe(catchError(handleError));
			}),
		);
	}

	public downloadProfile(id: string): Observable<Blob> {
		return this.http.get<Blob>(`http://localhost:3000/onboarding/profile-view/download-resume/${id}`, {
			responseType: 'blob' as 'json',
		});
	}
}
