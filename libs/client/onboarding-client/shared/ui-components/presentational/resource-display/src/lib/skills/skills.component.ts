import { Component, Input } from '@angular/core';

@Component({
	selector: 'tempus-resource-display-skills',
	templateUrl: './skills.component.html',
	styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent {
	@Input()
	skills: Array<string> = [];

	@Input()
	skillsSummary = '';
}
