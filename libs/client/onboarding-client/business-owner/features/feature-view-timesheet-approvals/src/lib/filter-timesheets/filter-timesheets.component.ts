import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ButtonType } from '@tempus/client/shared/ui-components/presentational';
import { RoleType } from '@tempus/shared-domain';

@Component({
	selector: 'tempus-filter-timesheets',
	templateUrl: './filter-timesheets.component.html',
	styleUrls: ['./filter-timesheets.component.scss'],
})
export class FilterTimesheetsComponent {
	constructor(private fb: FormBuilder) {}

	prefix = 'onboardingSupervisorTimesheets';

	@Input()
	filterForm: FormGroup = this.fb.group({});

	@Output() filterTableEvent = new EventEmitter<string>();

	@Output() clearFilterEvent = new EventEmitter<string>();

	commonPrefix = 'onboardingClient.input.common.';

	ButtonType = ButtonType;

	RoleType = RoleType;

	selectFilter() {
		this.filterTableEvent.emit('filterEvent');
	}

	selectClearFilter() {
		this.resetForm();
		this.clearFilterEvent.emit();
	}

	resetForm() {
		this.filterForm.get('pendingTimesheet')?.setValue(false);
		this.filterForm.get('approvedTimesheet')?.setValue(false);
		this.filterForm.get('rejectedTimesheet')?.setValue(false);
	}
}
