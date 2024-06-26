import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CardComponent } from './card/card.component';
import { ChipComponent } from './chip/chip.component';
import { TableComponent } from './table/table.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { ButtonComponent } from './button/button.component';
import { GhostButtonComponent } from './button/ghost-button/ghost-button.component';
import { SnackbarService } from './snackbar/snackbar.service';

@NgModule({
	imports: [
		CommonModule,
		MatIconModule,
		MatSelectModule,
		MatProgressSpinnerModule,
		MatChipsModule,
		MatCardModule,
		MatFormFieldModule,
		MatTableModule,
		MatPaginatorModule,
		MatButtonModule,
		MatSortModule,
		MatSnackBarModule,
		MatTooltipModule,
		TranslateModule.forChild({
			isolate: false,
			extend: true,
		}),
		RouterModule,
	],
	declarations: [
		CardComponent,
		ChipComponent,
		ButtonComponent,
		GhostButtonComponent,
		TableComponent,
		SpinnerComponent,
	],
	exports: [CardComponent, ChipComponent, ButtonComponent, GhostButtonComponent, TableComponent, SpinnerComponent],
	providers: [SnackbarService],
})
export class ClientSharedUiComponentsPresentationalModule {}
