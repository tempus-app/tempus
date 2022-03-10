import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
	selector: 'tempus-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
	ngOnInit(): void {
		this.getInitials(this.name);
		this.isVisible = true;
	}

	@Input() tabs: string[] = [];
	@Input() name: string = 'Placeholder Name';
	@Input() email: string = 'Placeholder email';
	@Output() selectTab = new EventEmitter();

	initials = '';
	isVisible = true;

	selectedTab(tab: string) {
		this.selectTab.emit(tab);
	}

	getInitials(name: string) {
		let fullName = name.split(' ');
		this.initials = (fullName[0].charAt(0) + fullName.pop()?.charAt(0)).toUpperCase();
	}

	toggleSidebar() {
		this.isVisible = !this.isVisible;
	}
}
