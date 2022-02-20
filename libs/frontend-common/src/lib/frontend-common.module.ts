import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ChipComponent } from './chip/chip.component'
import { MatChipsModule } from '@angular/material/chips'
import { MatIconModule } from '@angular/material/icon'
import { CardComponent } from './card/card.component'
import { MatCardModule } from '@angular/material/card'
@NgModule({
  imports: [CommonModule, MatChipsModule, MatIconModule, MatCardModule],
  declarations: [ChipComponent, CardComponent],
  exports: [ChipComponent, CardComponent],
})
export class FrontendCommon {}
