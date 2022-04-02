import { HttpHeaders } from '@angular/common/http';

export function getAuthHeaders(token: string): { headers: HttpHeaders } {
	return {
		headers: new HttpHeaders({
			Authorization: `Bearer ${token}`,
		}),
	};
}
