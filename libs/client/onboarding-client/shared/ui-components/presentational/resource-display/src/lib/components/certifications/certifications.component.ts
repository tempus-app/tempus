import { Component, Input } from '@angular/core';
import { formatDateRange, formatAddress } from '@tempus/client/shared/util';
import { ICreateCertificationDto } from '@tempus/shared-domain';

@Component({
	selector: 'tempus-resource-display-certifications',
	templateUrl: './certifications.component.html',
	styleUrls: ['./certifications.component.scss'],
})
export class CertificationsComponent {
	@Input()
	certifications: Array<ICreateCertificationDto> = [];

	static formatDate(startDate: Date, endDate: Date) {
		return formatDateRange(new Date(startDate), new Date(endDate));
	}

	static formatAddress(country: string, state: string, city: string) {
		return formatAddress(country, state, city);
	}
}
