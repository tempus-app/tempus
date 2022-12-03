import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ButtonType } from '@tempus/client/shared/ui-components/presentational';
import { RoleType } from '@tempus/shared-domain';
import { Country, State } from 'country-state-city';

@Component({
	selector: 'tempus-filter-resources',
	templateUrl: './filter-resources.component.html',
	styleUrls: ['./filter-resources.component.scss'],
})
export class FilterResourcesComponent {
	constructor(private fb: FormBuilder) {}

	prefix = 'onboardingOwnerManageResources.';

	@Input()
	filterForm: FormGroup = this.fb.group({});

	@Output() filterTableEvent = new EventEmitter<string>();

	@Output() clearFilterEvent = new EventEmitter<string>();

	commonPrefix = 'onboardingClient.input.common.';

	ButtonType = ButtonType;

	RoleType = RoleType;

	countries: string[] = Country.getAllCountries().map(country => {
		return country.name;
	});

	states: string[] = State.getAllStates().map(state => {
		return state.name;
	});

	updateStateOptions(inputtedCountry: string) {
		if (inputtedCountry === '') {
			this.states = [];
		}
		const countryCode = Country.getAllCountries().find(country => country.name === inputtedCountry);
		if (countryCode != null)
			this.states = State.getStatesOfCountry(countryCode.isoCode).map(state => {
				return state.name;
			});
		this.filterForm.get('province')?.setValue('');
	}

	selectFilter() {
		this.filterTableEvent.emit('filterEvent');
	}

	selectClearFilter() {
		this.resetForm();
		this.clearFilterEvent.emit();
	}

	resetForm() {
		this.filterForm.get('assignedResource')?.setValue(false);
		this.filterForm.get('availableResource')?.setValue(false);
		this.filterForm.get('country')?.setValue('');
		this.filterForm.get('province')?.setValue('');
	}
}
