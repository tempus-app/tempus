// report.service.ts in Angular

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CostReport } from './cost-reports.component';

@Injectable({ providedIn: 'root' })
export class ReportService {
	constructor(private http: HttpClient) {}

	getReports(): Observable<CostReport[]> {
		return this.http.get<CostReport[]>('http://localhost:3000/onboarding/reports'); // Adjust the URL as needed
	}
}
