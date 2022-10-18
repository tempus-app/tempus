import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '@tempus/app-config';
import { AppConfig, Client, ICreateClientDto, ICreateProjectDto, Project } from '@tempus/shared-domain';
import { catchError, Observable } from 'rxjs';
import { handleError } from './errorHandler';

@Injectable({ providedIn: 'root' })
export class OnboardingClientProjectService {
	constructor(private http: HttpClient, @Inject(APP_CONFIG) private appConfig: AppConfig) {}

	clientURL = `${this.appConfig.apiUrl}/onboarding/client`;

	projectURL = `${this.appConfig.apiUrl}/onboarding/project`;

	public getClients(): Observable<Client[]> {
		return this.http.get<Client[]>(`${this.clientURL}/`).pipe(catchError(handleError));
	}

	public createClient(createClientDto: ICreateClientDto): Observable<Client> {
		return this.http.post<Client>(`${this.clientURL}/`, createClientDto).pipe(catchError(handleError));
	}

	public createProject(createProjectDto: ICreateProjectDto): Observable<Project> {
		return this.http.post<Project>(`${this.projectURL}/`, createProjectDto).pipe(catchError(handleError));
	}

	public assignResourceToProject(projectId: number, resourceId: number): Observable<Project> {
		return this.http
			.post<Project>(`${this.projectURL}/${projectId}/${resourceId}/assign`, {})
			.pipe(catchError(handleError));
	}
}
