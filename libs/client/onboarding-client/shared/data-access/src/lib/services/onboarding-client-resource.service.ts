import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApproveViewDto } from '@tempus/api/shared/dto';
import { APP_CONFIG } from '@tempus/app-config';
import {
	AppConfig,
	ICreateResourceDto,
	ICreateViewDto,
	IUserProjClientDto,
	Resource,
	Revision,
	View,
} from '@tempus/shared-domain';
import { catchError, Observable, take, switchMap } from 'rxjs';
import { handleError } from './errorHandler';

@Injectable({ providedIn: 'root' })
export class OnboardingClientResourceService {
	constructor(private http: HttpClient, @Inject(APP_CONFIG) private appConfig: AppConfig) {}

	url = `${this.appConfig.apiUrl}/onboarding`;

	public createResource(createResourceDto: ICreateResourceDto): Observable<Resource> {
		return this.http.post<Resource>(`${this.url}/user/resource`, createResourceDto);
	}

	public saveResume(resourceId: number, resume: File | null): Observable<FormData> {
		const formData = new FormData();
		if (resume) {
			formData.append('resume', resume);
		}
		return this.http.patch<FormData>(`${this.url}/user/${resourceId}/resume`, formData);
	}

	public getResProjClientData(): Observable<IUserProjClientDto[]> {
		return this.http.get<IUserProjClientDto[]>(`${this.url}/user/basic`).pipe(catchError(handleError));
	}

	public getResourceInformation(): Observable<Resource> {
		console.log('getResourceInformation');
		return this.http.get<Resource>(`${this.url}/user/user`).pipe(catchError(handleError));
	}

	public getResourceInformationById(resourceId: number): Observable<Resource> {
		return this.http.get<Resource>(`${this.url}/user/${resourceId}`).pipe(catchError(handleError));
	}

	public getResourceOriginalResumeById(resourceId: number): Observable<Blob> {
    return this.http
      .get<Blob>(`${this.url}/user/${resourceId}/resume`, {responseType: 'blob' as 'json' })
      .pipe(catchError(handleError));
	}

	public getViewById(viewId: number): Observable<View> {
		return this.http.get<View>(`${this.url}/profile-view/view/${viewId}`).pipe(catchError(handleError));
	}

	// Get latest updated primary view by resource
	public getLatestPrimaryView(resourceId: number): Observable<View> {
		return this.getResourceProfileViews(resourceId).pipe(
			take(1),
			switchMap(views =>
				views
					.filter(view => view.viewType === 'PRIMARY')
					.sort((a, b) =>
						// eslint-disable-next-line no-nested-ternary
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
		return this.http.get<Array<View>>(`${this.url}/profile-view/${resourceId}`).pipe(catchError(handleError));
	}

	public editResourceView(viewId: number, newView: ICreateViewDto): Observable<Revision> {
		return this.http.patch<Revision>(`${this.url}/profile-view/${viewId}`, newView).pipe(catchError(handleError));
	}

	public downloadProfile(id: number): Observable<Blob> {
		const httpOptions = {
			responseType: 'blob' as 'json',
		};
		return this.http.get<Blob>(`${this.url}/profile-view/download-resume/${id}`, httpOptions);
	}

	public approveOrDenyRevision(id: number, comment: string, approval: boolean): Observable<ApproveViewDto> {
		return this.http
			.post<ApproveViewDto>(`${this.url}/profile-view/approve/${id}`, { comment, approval })
			.pipe(catchError(handleError));
	}
}
