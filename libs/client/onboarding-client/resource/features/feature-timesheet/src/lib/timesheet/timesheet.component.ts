import { Component, Injectable, OnInit, VERSION } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { DateRange, MatDateRangeSelectionStrategy, MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { TranslateService } from '@ngx-translate/core';

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

const ELEMENT_DATA: TableOfContents[] = [
  {position: 1, project: 'Project 1', sunday: '', monday: '7.5', tuesday: '', wednesday: '', thursday: '7.5', friday: '7.5', saturday: '', total: 22.5},
  {position: 2, project: 'Project 2', sunday: '', monday: '', tuesday: '7.5', wednesday: '7.5', thursday: '', friday: '', saturday: '', total: 15}
];

export interface TableOfContents {
  position: number;
  project: string;
  total: number;
  sunday: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
}

@Component({
  selector: 'tempus-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss'],
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: WeekSelectionStrategy,
    }
  ]
})
export class TimesheetComponent implements OnInit {
  prefix = 'onboardingResourceTimesheet';

  constructor(private translateService: TranslateService) {
    const { currentLang } = translateService;
		translateService.currentLang = '';
		translateService.use(currentLang);
   }

  displayedColumns: string[] = ['position', 'project', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'total'];
  dataSource = ELEMENT_DATA;

  //created dummy data for days of the week in table
  version = VERSION.full;
  formatsDateTest: string[] = ['fullDate'];
  dateNow: Date = new Date();

  ngOnInit(): void {
    
  }

}
