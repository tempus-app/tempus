import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tempus-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements OnInit {
  @Input() type: 'primary' | 'secondary' | 'text' = 'text';
  @Input() placeholder = '';
  constructor() { }

  ngOnInit(): void {
  }

}
