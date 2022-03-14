import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICreateResourceDto, Resource } from '@tempus/shared-domain';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OnboardingClientResourceService {
	constructor(private http: HttpClient) {}

	url = 'http://localhost:3000/onboarding/';

	public createResource(createResourceDto: ICreateResourceDto): Observable<Resource> {
		return this.http.post<Resource>(`${this.url}/user/resource`, createResourceDto);
	}
}
