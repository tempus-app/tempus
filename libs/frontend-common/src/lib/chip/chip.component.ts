import { Component, Input, OnInit } from '@angular/core'
@Component({
  selector: 'tempus-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
})
export class ChipComponent implements OnInit {
  @Input() cssId: string = 'skill-select'
  @Input() removable: boolean = false
  constructor() {}

  ngOnInit(): void {}
}
