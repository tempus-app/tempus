import { Component, Injectable, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { DateRange, MatDateRangeSelectionStrategy, MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';

@Injectable()
export class WeekSelectionStrategy implements MatDateRangeSelectionStrategy<string> {
  
  constructor(private _dateAdapter: DateAdapter<string>) {}

  selectionFinished(date: string | null): DateRange<string> {

    return this._createWeekRange(date);
    
  }

  createPreview(activeDate: string | null): DateRange<string> {

    return this._createWeekRange(activeDate);

  }

  private _createWeekRange(date: string | null): DateRange<string> {

    if (date) {

      const theDate = new Date(date);
      const start = new Date(theDate.setDate(theDate.getDate() - theDate.getDay() + (theDate.getDay() == -1 ? -7 : 0)));
      const end = new Date (theDate.setDate(theDate.getDate() - theDate.getDay() + (theDate.getDay() == -1 ? -7 : 0) + 6))
      return new DateRange<any>(start, end);

    }

    return new DateRange<string>(null, null);

  }
}

@Component({
  selector: 'tempus-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css'],
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: WeekSelectionStrategy,
    }
  ]
})
export class TimesheetComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    
  }

}
