import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { UserType } from './sidebar-type-enum';

@Component({
	selector: 'tempus-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
	ngOnInit(): void {
		this.setUserTabs();
		this.getInitials(this.name);
		this.isVisible = true;
	}

	@Input() userType?: UserType = undefined;

	@Input() tabs: string[] = [];

	@Input() name = 'Placeholder Name';

	@Input() email = 'Placeholder email';

	@Output() selectTab = new EventEmitter();

	initials = '';

	isVisible = true;

	setUserTabs() {
		if (this.userType === UserType.OWNER) {
			this.tabs = ['Manage Resources', 'Pending Approvals'];
		} else if (this.userType === UserType.RESOURCE) {
			this.tabs = ['Primary View', 'My Views', 'My Projects'];
		}
	}

	selectedTab(tab: string) {
		this.selectTab.emit(tab);
	}

	getInitials(name: string) {
		const fullName = name.split(' ');
		this.initials = (fullName[0].charAt(0) + fullName.pop()?.charAt(0)).toUpperCase();
	}

	toggleSidebar() {
		this.isVisible = !this.isVisible;
	}
}
