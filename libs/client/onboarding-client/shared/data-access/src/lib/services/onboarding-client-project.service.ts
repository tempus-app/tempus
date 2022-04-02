import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Client, Project } from '@tempus/shared-domain';
import { catchError, Observable, switchMap, take } from 'rxjs';
import { OnboardingClientState, selectAccessToken } from '../+state';
import { handleError } from './errorHandler';
import { getAuthHeaders } from './service.common';

@Injectable({ providedIn: 'root' })
export class OnboardingClientProjectService {
	constructor(private http: HttpClient, private authStore: Store<OnboardingClientState>) {}

	clientURL = 'http://localhost:3000/onboarding/client';

	projectURL = 'http://localhost:3000/onboarding/project';

	public getProjectsBasic(): Observable<Project[]> {
		return this.authStore.select(selectAccessToken).pipe(
			take(1),
			switchMap(token => {
				const httpAuthHeaders = getAuthHeaders(token || '');
				return this.http.get<Project[]>(`${this.projectURL}/`, httpAuthHeaders).pipe(catchError(handleError));
			}),
		);
	}

	public getClientsBasic(): Observable<Client[]> {
		return this.authStore.select(selectAccessToken).pipe(
			take(1),
			switchMap(token => {
				const httpAuthHeaders = getAuthHeaders(token || '');
				return this.http.get<Client[]>(`${this.clientURL}/`, httpAuthHeaders).pipe(catchError(handleError));
			}),
		);
	}
}
