import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '@tempus/app-config';
import {
	AppConfig,
	Client,
	IAssignProjectDto,
	ICreateClientDto,
	ICreateProjectDto,
	Project,
} from '@tempus/shared-domain';
import { catchError, Observable, Subject } from 'rxjs';
import { handleError } from './errorHandler';

@Injectable({ providedIn: 'root' })
export class OnboardingClientProjectService {
	constructor(private http: HttpClient, @Inject(APP_CONFIG) private appConfig: AppConfig) {}

	clientURL = `${this.appConfig.apiUrl}/onboarding/client`;

	projectURL = `${this.appConfig.apiUrl}/onboarding/project`;

	private subject = new Subject<boolean>();

	sendCreateProjectClickEvent(clicked: boolean) {
		this.subject.next(clicked);
	}

	getCreateProjectClickEvent(): Observable<boolean> {
		return this.subject.asObservable();
	}

	public getClients(): Observable<Client[]> {
		return this.http.get<Client[]>(`${this.clientURL}/`).pipe(catchError(handleError));
	}

	public createClient(createClientDto: ICreateClientDto): Observable<Client> {
		return this.http.post<Client>(`${this.clientURL}/`, createClientDto).pipe(catchError(handleError));
	}

	public createProject(createProjectDto: ICreateProjectDto): Observable<Project> {
		return this.http.post<Project>(`${this.projectURL}/`, createProjectDto).pipe(catchError(handleError));
	}

	public getAllProjects(paginationData: {
		page: number;
		pageSize: number;
	}): Observable<{ projectData: Project[]; totalItems: number }> {
		const { page, pageSize } = paginationData;
		return this.http
			.get<{ projectData: Project[]; totalItems: number }>(`${this.projectURL}?page=${page}&pageSize=${pageSize}`)
			.pipe(catchError(handleError));
	}

	public assignResourceToProject(
		projectId: number,
		resourceId: number,
		assignProjectDto: IAssignProjectDto,
	): Observable<Project> {
		return this.http
			.patch<Project>(`${this.projectURL}/${projectId}/${resourceId}/assign`, assignProjectDto)
			.pipe(catchError(handleError));
	}
}
