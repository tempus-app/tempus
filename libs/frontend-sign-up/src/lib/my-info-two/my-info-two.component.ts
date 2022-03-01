import { Component, OnInit, OnDestroy } from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'tempus-my-info-two',
  templateUrl: './my-info-two.component.html',
  styleUrls: ['./my-info-two.component.scss']
})
export class MyInfoTwoComponent implements OnInit {

  destroyed = new Subject<void>();
  cols: string = '1';
  rows: string = '10';
  numberWorkSections: number[] = [1];
  hideElement = true;


  // Create a map to display breakpoint names for demonstration purposes.

  constructor(breakpointObserver: BreakpointObserver) {
    breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            if (query == Breakpoints.XSmall || query == Breakpoints.Small ){
              this.rows = '15';
              this.cols = '2';
              this.hideElement = false;
            }else{
              this.rows = '10';
              this.cols = '1';
              this.hideElement = true;
            }

          }
        }
      });
  }

  ngOnInit(): void {
  }


  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  incrementWorkSections(){
    this.numberWorkSections.push(this.numberWorkSections.length + 1);
  }

  decrementWorkSections(){
    this.numberWorkSections.pop();
  }


}
