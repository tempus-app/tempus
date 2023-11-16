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
		resourceComment: '',
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

	sundayDate = ''; // sunday

	saturdayDate = ''; // saturday

	mondayDate = ''; // monday

	tuesdayDate = ''; // tuesday

	wednesdayDate = ''; // wednesday

	thursdayDate = ''; // thursday

	fridayDate = ''; // friday

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

	totalHours = 0; // Total hours

	constructor(private resourceService: OnboardingClientResourceService) {}

	ngOnInit() {
		// Set column names for each day of the week in the date range

		// Get start date and end date and store in variables
		const startDateRange = this.timesheet.weekStartDate!;
		const endDateRange = this.timesheet.weekEndDate!;

		// Variable for current date
		let currentDate = new Date(startDateRange);

		// Set all the column variables
		this.sundayDate = currentDate.toLocaleString();
		currentDate.setDate(currentDate.getDate() + 1);
		this.mondayDate = currentDate.toLocaleString();
		currentDate.setDate(currentDate.getDate() + 1);
		this.tuesdayDate = currentDate.toLocaleString();
		currentDate.setDate(currentDate.getDate() + 1);
		this.wednesdayDate = currentDate.toLocaleString();
		currentDate.setDate(currentDate.getDate() + 1);
		this.thursdayDate = currentDate.toLocaleString();
		currentDate.setDate(currentDate.getDate() + 1);
		this.fridayDate = currentDate.toLocaleString();
		currentDate.setDate(currentDate.getDate() + 1);
		this.saturdayDate = currentDate.toLocaleString();

		// Calculate the total hours
		this.totalHours =
			(this.timesheet.mondayHours ?? 0) +
			(this.timesheet.tuesdayHours ?? 0) +
			(this.timesheet.wednesdayHours ?? 0) +
			(this.timesheet.thursdayHours ?? 0) +
			(this.timesheet.fridayHours ?? 0) +
			(this.timesheet.saturdayHours ?? 0) +
			(this.timesheet.sundayHours ?? 0);
	}
}
