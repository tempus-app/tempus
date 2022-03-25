import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ButtonType, Column } from '@tempus/client/shared/ui-components/presentational';
import { TranslateService } from '@ngx-translate/core';
import { UserType } from '@tempus/client/shared/ui-components/persistent';

@Component({
	selector: 'tempus-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	data = [
		{
			name: 'Gabriel Granata',
			email: 'gabriel.granata@hotmail.com',
		},
		{
			name: 'Mustafa Ali',
			email: 'mustafa.ali@email.com',
		},
		{
			name: 'Georges Chamoun',
			email: 'georges.chamoun@email.com',
		},
	];

	tableColumns: Array<Column> = [
		{
			columnDef: 'name',
			header: 'Name',
			cell: (element: Record<string, any>) => `${element.name}`,
		},
		{
			columnDef: 'email',
			header: 'Email',
			cell: (element: Record<string, any>) => `${element.email}`,
		},
	];

	ButtonType = ButtonType;

	constructor(private http: HttpClient, private translateService: TranslateService) {
		translateService.setDefaultLang('en');
		translateService.use('en');
	}
}
