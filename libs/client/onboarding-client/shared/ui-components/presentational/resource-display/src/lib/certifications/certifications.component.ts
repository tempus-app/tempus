import { Component, Input } from '@angular/core';
import { formatDateRange, formatAddress, formatName } from '@tempus/shared/util';
import { ICreateCertificationDto } from '@tempus/shared-domain';

@Component({
	selector: 'tempus-resource-display-certifications',
	templateUrl: './certifications.component.html',
	styleUrls: ['./certifications.component.scss'],
})
export class CertificationsComponent {
	@Input()
	certifications: Array<ICreateCertificationDto> = [];

	formatDate(startDate: Date, endDate: Date) {
		return formatDateRange(new Date(startDate), new Date(endDate));
	}

	formatAddress(country: string, state: string, city: string) {
		return formatAddress(country, state, city);
	}
}
