import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Link } from '@tempus/shared-domain';

@Component({
	selector: 'tempus-credentials',
	templateUrl: './credentials.component.html',
	styleUrls: ['./credentials.component.scss'],
})
export class CredentialsComponent implements OnInit {
	tokenId = '';

	link: Link | undefined;

	constructor(private route: ActivatedRoute) {}

	ngOnInit() {
		this.tokenId = this.route.snapshot.paramMap.get('token') || '';
		this.getLinkData();
	}

	getLinkData() {
		// TODO: implement me
		this.link = { email: 'testCal@gmail.com' };
	}
}
