/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '@tempus/app-config';
import {
	AppConfig,
	IApproveTimesheetDto,
	ICreateTimesheetDto,
	IReportFiltersDto,
	IUpdateTimesheetDto,
	Report,
	RevisionType,
	Timesheet,
	View,
} from '@tempus/shared-domain';
import { catchError, Observable } from 'rxjs';
import { UpdateTimesheetDto } from '@tempus/api/shared/dto';
import { handleError } from './errorHandler';

@Injectable({ providedIn: 'root' })
export class OnboardingClientTimesheetsService {
	constructor(private http: HttpClient, @Inject(APP_CONFIG) private appConfig: AppConfig) {}

	timesheetURL = `${this.appConfig.apiUrl}/onboarding/timesheet`;

	public getTimesheetById(timesheetId: number): Observable<Timesheet> {
		return this.http.get<Timesheet>(`${this.timesheetURL}/${timesheetId}`).pipe(catchError(handleError));
	}

	public getTimesheetsBySupervisorId(
		supervisorId: number,
		page: number,
		pageSize: number,
	): Observable<{ timesheets: Timesheet[]; totalTimesheets: number }> {
		return this.http
			.get<{ timesheets: Timesheet[]; totalTimesheets: number }>(
				`${this.timesheetURL}/supervisor-timesheets/${supervisorId}?page=${page}&pageSize=${pageSize}`,
				{},
			)
			.pipe(catchError(handleError));
	}

	public getTimesheetsByClientId(
		clientId: number,
		page: number,
		pageSize: number,
	): Observable<{ timesheets: Timesheet[]; totalTimesheets: number }> {
		return this.http
			.get<{ timesheets: Timesheet[]; totalTimesheets: number }>(
				`${this.timesheetURL}/client-timesheets/${clientId}?page=${page}&pageSize=${pageSize}`,
				{},
			)
			.pipe(catchError(handleError));
	}

	public getTimesheetsByResourceId(
		resourceId: number,
		page: number,
		pageSize: number,
	): Observable<{ timesheets: Timesheet[]; totalTimesheets: number }> {
		return this.http
			.get<{ timesheets: Timesheet[]; totalTimesheets: number }>(
				`${this.timesheetURL}/resource-timesheets/${resourceId}?page=${page}&pageSize=${pageSize}`,
				{},
			)
			.pipe(catchError(handleError));
	}

	public createTimesheet(createTimesheetDto: ICreateTimesheetDto): Observable<Timesheet> {
		return this.http.post<Timesheet>(`${this.timesheetURL}/`, createTimesheetDto).pipe(catchError(handleError));
	}

	public editTimesheet(updatedTimesheet: UpdateTimesheetDto): Observable<Timesheet> {
		return this.http.patch<Timesheet>(`${this.timesheetURL}/`, updatedTimesheet).pipe(catchError(handleError));
	}

	public deleteTimesheet(timesheetId: number): Observable<Timesheet> {
		return this.http.delete<Timesheet>(`${this.timesheetURL}/${timesheetId}`).pipe(catchError(handleError));
	}

	public updateTimesheetStatusAsSupervisor(
		timesheetId: number,
		approveTimesheetDto: IApproveTimesheetDto,
	): Observable<{ timesheet: Timesheet }> {
		return this.http.patch<{ timesheet: Timesheet }>(
			`${this.timesheetURL}/approve/${timesheetId}`,
			approveTimesheetDto,
			{},
		);
	}

	public getReport(
		userId: number,
		reportFilters: IReportFiltersDto,
	  ): Observable<Report[]> {

		let url =  `${this.appConfig.apiUrl}/onboarding/report/${userId}?clientId=${reportFilters.clientId}&projectId=${reportFilters.projectId}&resourceId=${reportFilters.resourceId}&startDate=${reportFilters.startDate}&endDate=${reportFilters.endDate}`;
		return this.http
		  .get<Report[]>(url)
		  .pipe(catchError(handleError));
	  }

	public updateTimesheetStatusAsClient(
		timesheetId: number,
		approveTimesheetDto: IApproveTimesheetDto,
	): Observable<{ timesheet: Timesheet }> {
		return this.http.patch<{ timesheet: Timesheet }>(
			`${this.timesheetURL}/approve/client/${timesheetId}`,
			approveTimesheetDto,
			{},
		);
	}
}
