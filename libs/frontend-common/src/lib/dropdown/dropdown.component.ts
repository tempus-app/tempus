import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
@Component({
  selector: 'tempus-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit {
  @Input() options: string[] = [];
  @Input() cssClass: string = '';
  @Input() label: string = '';
  @Output() optionSelect = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  optionSelected(option: string){
    this.optionSelect.emit(option);
  }
}
