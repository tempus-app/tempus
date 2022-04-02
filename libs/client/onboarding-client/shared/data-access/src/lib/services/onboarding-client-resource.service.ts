import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ICreateResourceDto, IUserProjClientDto, Resource } from '@tempus/shared-domain';
import { catchError, Observable, switchMap, take } from 'rxjs';
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
			switchMap(token => {
				const httpAuthHeaders = getAuthHeaders(token || '');
				return this.http.get<IUserProjClientDto[]>(`${this.url}/basic`, httpAuthHeaders).pipe(catchError(handleError));
			}),
		);
	}
}
