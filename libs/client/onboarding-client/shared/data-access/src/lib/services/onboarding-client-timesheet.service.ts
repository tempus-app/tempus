import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '@tempus/app-config';
import { AppConfig, ICreateTimesheetDto, RevisionType, Timesheet, View } from '@tempus/shared-domain';
import { catchError, Observable } from 'rxjs';
import { handleError } from './errorHandler';

@Injectable({ providedIn: 'root' })
export class OnboardingClientTimesheetsService {
	constructor(private http: HttpClient, @Inject(APP_CONFIG) private appConfig: AppConfig) {}

	timesheetURL = `${this.appConfig.apiUrl}/onboarding/timesheet`;

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
}
