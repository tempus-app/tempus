import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApproveViewDto } from '@tempus/api/shared/dto';
import { APP_CONFIG } from '@tempus/app-config';
import {
	AppConfig,
	AzureAccount,
	ICreateResourceDto,
	ICreateViewDto,
	IResourceBasicDto,
	IUpdateResourceDto,
	IUserProjClientDto,
	Resource,
	Revision,
	RoleType,
	View,
} from '@tempus/shared-domain';
import { catchError, Observable } from 'rxjs';
import { handleError } from './errorHandler';

@Injectable({ providedIn: 'root' })
export class OnboardingClientResourceService {
	constructor(private http: HttpClient, @Inject(APP_CONFIG) private appConfig: AppConfig) {}

	url = `${this.appConfig.apiUrl}/onboarding`;

	public createResource(createResourceDto: ICreateResourceDto): Observable<Resource> {
		return this.http.post<Resource>(`${this.url}/user/resource`, createResourceDto);
	}

	public createResourceAzureAccount(resourceId: number): Observable<AzureAccount> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Access-Control-Allow-Origin': '*',
			}),
		};

		return this.http
			.post<AzureAccount>(`${this.url}/user/azureAccount/${resourceId}`, httpOptions)
			.pipe(catchError(handleError));
	}

	public deleteResourceAzureAccount(resourceId: number): Observable<void> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Access-Control-Allow-Origin': '*',
			}),
		};

		return this.http
			.delete<void>(`${this.url}/user/azureAccount/${resourceId}`, httpOptions)
			.pipe(catchError(handleError));
	}

	public saveResume(resourceId: number, resume: File | null): Observable<FormData> {
		const formData = new FormData();
		if (resume) {
			formData.append('resume', resume);
		}
		return this.http.patch<FormData>(`${this.url}/user/${resourceId}/resume`, formData);
	}

	public getResProjClientData(paginationData: {
		page: number;
		pageSize: number;
		filter: string;
		roleType?: RoleType[];
		country?: string;
		province?: string;
	}): Observable<{ userProjClientData: IUserProjClientDto[]; totalItems: number }> {
		const { page, pageSize, filter, roleType, country, province } = paginationData;
		let url = `${this.url}/user/resProjects?page=${page}&pageSize=${pageSize}&filter=${filter}`;
		if (roleType && roleType.length > 0) {
			url = `${url}&roleType=${roleType.join()}`;
		}
		if (country) {
			url = `${url}&country=${country}`;
			if (province) {
				url = `${url}&province=${province}`;
			}
		}
		return this.http
			.get<{ userProjClientData: IUserProjClientDto[]; totalItems: number }>(url)
			.pipe(catchError(handleError));
	}

	public getResourceBasicInformation(): Observable<IResourceBasicDto[]> {
		return this.http.get<IResourceBasicDto[]>(`${this.url}/user/resourcesBasic`).pipe(catchError(handleError));
	}

	public getAllSearchableTerms(): Observable<Array<string>> {
		return this.http.get<Array<string>>(`${this.url}/user/searchableTerms`).pipe(catchError(handleError));
	}

	public getResourceInformation(): Observable<Resource> {
		return this.http.get<Resource>(`${this.url}/user/user`).pipe(catchError(handleError));
	}

	public getResourceInformationById(resourceId: number): Observable<Resource> {
		return this.http.get<Resource>(`${this.url}/user/${resourceId}`).pipe(catchError(handleError));
	}

	public getResourceOriginalResumeById(resourceId: number): Observable<Blob> {
		return this.http
			.get<Blob>(`${this.url}/user/${resourceId}/resume`, { responseType: 'blob' as 'json' })
			.pipe(catchError(handleError));
	}

	// TODO: look into moving to views service
	// DELETE
	public getViewById(viewId: number): Observable<View> {
		return this.http.get<View>(`${this.url}/profile-view/view/${viewId}`).pipe(catchError(handleError));
	}

	// TODO: look into moving to views service
	public getResourceProfileViews(resourceId: number): Observable<{ views: View[]; totalPendingApprovals: number }> {
		return this.http
			.get<{ views: View[]; totalPendingApprovals: number }>(`${this.url}/profile-view/${resourceId}`)
			.pipe(catchError(handleError));
	}

	// DELETE
	public createSecondaryView(resourceId: number, newView: ICreateViewDto): Observable<View> {
		return this.http
			.post<View>(`${this.url}/profile-view/${resourceId}/new-view`, newView)
			.pipe(catchError(handleError));
	}

	// DELETE
	public editResourceView(viewId: number, newView: ICreateViewDto): Observable<Revision> {
		return this.http.patch<Revision>(`${this.url}/profile-view/${viewId}`, newView).pipe(catchError(handleError));
	}

	public editResourcePersonalInformation(updatedPersonalInformation: IUpdateResourceDto): Observable<Resource> {
		return this.http
			.patch<Resource>(`${this.url}/user/resource`, updatedPersonalInformation)
			.pipe(catchError(handleError));
	}

	public downloadProfile(viewId: number): Observable<Blob> {
		const httpOptions = {
			responseType: 'blob' as 'json',
		};
		return this.http.get<Blob>(`${this.url}/profile-view/download-resume/${viewId}`, httpOptions);
	}

	// DELETE
	public approveOrDenyRevision(id: number, comment: string, approval: boolean): Observable<ApproveViewDto> {
		return this.http
			.post<ApproveViewDto>(`${this.url}/profile-view/approve/${id}`, { comment, approval })
			.pipe(catchError(handleError));
	}

	public deleteResource(resourceId: number): Observable<Resource> {
		return this.http.delete<Resource>(`${this.url}/user/${resourceId}`).pipe(catchError(handleError));
	}
}
