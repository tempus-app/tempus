import { CommonModule } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CertificationsComponent } from '../components/certifications/certifications.component';

describe('CertificationsComponent', () => {
	let component: CertificationsComponent;
	let fixture: ComponentFixture<CertificationsComponent>;
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				CommonModule,
				FlexLayoutModule,
				MatGridListModule,
				MatFormFieldModule,
				MatButtonModule,
				MatTooltipModule,
				MatChipsModule,
				MatIconModule,
				ClientSharedUiComponentsInputModule,
				ClientSharedUiComponentsPresentationalModule,
				BrowserAnimationsModule,
			],
			declarations: [CertificationsComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CertificationsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should load input card on add', fakeAsync(() => {
		const button = fixture.debugElement.query(By.css('#add-button'));
		button.triggerEventHandler('click', null);
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.css('.certification-input-container'))).toBeTruthy();
	}));

	it('should remove input card on remove', fakeAsync(() => {
		const addButton = fixture.debugElement.query(By.css('#add-button'));
		addButton.triggerEventHandler('click', null);
		fixture.detectChanges();

		expect(fixture.debugElement.query(By.css('.certification-input-container'))).toBeTruthy();
		const removeButton = fixture.debugElement.query(By.css('#remove-button'));
		removeButton.triggerEventHandler('click', null);
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.css('.certification-input-container'))).toBeNull();
	}));

	it('should display errors if title is touched and missing', fakeAsync(() => {
		const addButton = fixture.debugElement.query(By.css('#add-button'));
		addButton.triggerEventHandler('click', null);
		fixture.detectChanges();

		const el = fixture.debugElement.query(By.css('#title-0')).nativeElement;

		el.value = 'Title';
		el.dispatchEvent(new Event('input'));

		fixture.detectChanges();

		el.value = '';
		el.dispatchEvent(new Event('input'));
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.css('#title-error'))).toBeTruthy();

		// trigger input change
	}));

	it('should display errors if authority is touched and missing', fakeAsync(() => {
		const addButton = fixture.debugElement.query(By.css('#add-button'));
		addButton.triggerEventHandler('click', null);
		fixture.detectChanges();

		const el = fixture.debugElement.query(By.css('#certifying-authority-0')).nativeElement;

		el.value = 'Authority';
		el.dispatchEvent(new Event('input'));

		fixture.detectChanges();

		el.value = '';
		el.dispatchEvent(new Event('input'));
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.css('#certifying-authority-error'))).toBeTruthy();
	}));

	it('should display errors if authority is touched and missing', fakeAsync(() => {
		const addButton = fixture.debugElement.query(By.css('#add-button'));
		addButton.triggerEventHandler('click', null);
		fixture.detectChanges();

		const el = fixture.debugElement.query(By.css('#certifying-authority-0')).nativeElement;

		el.value = 'Authority';
		el.dispatchEvent(new Event('input'));

		fixture.detectChanges();

		el.value = '';
		el.dispatchEvent(new Event('input'));
		fixture.detectChanges();
		expect(fixture.debugElement.query(By.css('#certifying-authority-error'))).toBeTruthy();
	}));

	it('should not display an error if summary is touched not missing', fakeAsync(() => {
		const addButton = fixture.debugElement.query(By.css('#add-button'));
		addButton.triggerEventHandler('click', null);
		fixture.detectChanges();

		const el = fixture.debugElement.query(By.css('#summary-0')).nativeElement;
		el.dispatchEvent(new Event('input'));
		fixture.detectChanges();

		expect(fixture.debugElement.query(By.css('#summary-error'))).toBeNull();
	}));
});
