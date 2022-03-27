import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
import { ContentModalComponent } from './content-modal/content-modal.component';
import { InfoModalComponent } from './info-modal/info-modal.component';
import { ModalService } from './service/modal.service';

@NgModule({
	imports: [
		CommonModule,
		MatIconModule,
		MatDialogModule,
		MatButtonModule,
		ClientSharedUiComponentsPresentationalModule,
		FlexLayoutModule,
	],
	declarations: [InfoModalComponent, ContentModalComponent],
	exports: [InfoModalComponent, ContentModalComponent],
	providers: [ModalService],
})
export class ClientSharedUiComponentsModalModule {}
