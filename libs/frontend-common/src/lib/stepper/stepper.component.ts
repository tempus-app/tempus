import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatStep } from '@angular/material/stepper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tempus-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class StepperComponent implements OnInit {
  @Input() steps: Array<string> = [];

  @Input() color = 'primary';

  constructor() {}

  ngOnInit(): void {}
}
