import { Component, OnInit, OnDestroy } from '@angular/core';
import { Country, State, City }  from 'country-state-city';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
@Component({
  selector: 'tempus-my-info-one',
  templateUrl: './my-info-one.component.html',
  styleUrls: ['./my-info-one.component.scss']
})
export class MyInfoOneComponent implements OnInit {
  countries: string[] =  Country.getAllCountries().map(country => { return country.name});
  states: string[] =  State.getAllStates().map(state => { return state.name});
  destroyed = new Subject<void>();
  cols: string = '1';
  rows: string = '5';


  // Create a map to display breakpoint names for demonstration purposes.
  displayNameMap = new Map([
    [Breakpoints.XSmall, '1'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);

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
              this.rows = '8';
              this.cols = '2';
            }else{
              this.rows = '5';
              this.cols = '1';
            }

          }
        }
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
  ngOnInit(): void {
  }

  updateStateOptions(inputtedCountry: string){
    let countryCode =  Country.getAllCountries().find(country => country.name === inputtedCountry);
    console.log(countryCode)
    if (countryCode != null)
      this.states = State.getStatesOfCountry(countryCode.isoCode).map(state => { return state.name});
  }

}
