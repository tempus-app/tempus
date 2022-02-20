import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
@Component({
  selector: 'tempus-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
})
export class ChipComponent implements OnInit {
  @Input() cssId: string = 'skill'
  @Input() removable: boolean = true
  @Input() typography: string = 'subheading-1'
  @Output() onRemove: EventEmitter<any> = new EventEmitter()

  removeChip() {
    this.onRemove.emit('closed')
  }

  constructor() {}

  ngOnInit(): void {}
}
