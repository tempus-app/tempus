import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
@Component({
  selector: 'tempus-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
})
export class ChipComponent implements OnInit {
  @Input() cssId: string = 'skill-select'
  @Input() removable: boolean = true
  @Input() typography: string = 'mat-button'
  @Output() onRemove: EventEmitter<any> = new EventEmitter()

  removeChip() {
    this.onRemove.emit('closed')
  }

  constructor() {}

  ngOnInit(): void {}
}
