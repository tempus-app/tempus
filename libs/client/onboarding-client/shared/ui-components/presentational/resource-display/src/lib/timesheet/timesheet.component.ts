/* eslint-disable */
import { Component, Injectable, Input, OnInit } from '@angular/core';
import { ICreateTimesheetDto } from '@tempus/shared-domain';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
	DateRange,
	MatDateRangePicker,
	MatDateRangeSelectionStrategy,
	MAT_DATE_RANGE_SELECTION_STRATEGY,
} from '@angular/material/datepicker';
import { InputType } from '@tempus/client/shared/ui-components/input';
import { DateAdapter } from '@angular/material/core';
import { OnboardingClientResourceService } from '@tempus/client/onboarding-client/shared/data-access';
import { log } from 'console';

const ELEMENT_DATA: TableOfContents[] = [
	{
		position: 1,
		project: 'Project 1',
		sunday: '',
		monday: '',
		tuesday: '',
		wednesday: '',
		thursday: '',
		friday: '',
		saturday: '',
		total: '',
	},
];

// Table of contents interface
export interface TableOfContents {
	position: number;
	project: string;
	total: string;
	sunday: string;
	monday: string;
	tuesday: string;
	wednesday: string;
	thursday: string;
	friday: string;
	saturday: string;
}

@Component({
	selector: 'tempus-resource-display-timesheet',
	templateUrl: './timesheet.component.html',
	styleUrls: ['./timesheet.component.scss'],
})
export class TimesheetComponent {
	@Input() timesheet: ICreateTimesheetDto = {
		projectId: 0,
		resourceId: 0,
		supervisorId: 0,
		weekStartDate: new Date(),
		weekEndDate: new Date(),
		approvedBySupervisor: false,
		approvedByClient: false,
		supervisorComment: '',
		clientRepresentativeComment: '',
		audited: false,
		billed: false,
		mondayHours: 0,
		tuesdayHours: 0,
		wednesdayHours: 0,
		thursdayHours: 0,
		fridayHours: 0,
		saturdayHours: 0,
		sundayHours: 0,
	};

	@Input() projectName = '';

	@Input() from!: Date;

	@Input() thru!: Date;

	startDate2 = ''; // sunday

	endDate2 = ''; // saturday

	startDatePlusOne2 = ''; // monday

	startDatePlusTwo2 = ''; // tuesday

	startDatePlusThree2 = ''; // wednesday

	startDatePlusFour2 = ''; // thursday

	startDatePlusFive2 = ''; // friday

	changed(picker: MatDateRangePicker<any>) {}

	// Columns for the timesheet table
	displayedColumns: string[] = [
		'position',
		'project',
		'sunday',
		'monday',
		'tuesday',
		'wednesday',
		'thursday',
		'friday',
		'saturday',
		'total',
	];

	dataSource = ELEMENT_DATA;

	projectSelected = new FormControl(this.projectName);

	totalHours =
		this.timesheet.mondayHours! +
		this.timesheet.tuesdayHours! +
		this.timesheet.wednesdayHours! +
		this.timesheet.thursdayHours! +
		this.timesheet.fridayHours! +
		this.timesheet.saturdayHours! +
		this.timesheet.sundayHours!;

	constructor(private resourceService: OnboardingClientResourceService) {}
}
