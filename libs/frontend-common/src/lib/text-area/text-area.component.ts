import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'tempus-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss'],
})
export class TextAreaComponent implements OnInit {
  @Input() cssClass: string = ''
  @Input() placeholder: string = ''
  constructor() {}

  ngOnInit(): void {}
}
