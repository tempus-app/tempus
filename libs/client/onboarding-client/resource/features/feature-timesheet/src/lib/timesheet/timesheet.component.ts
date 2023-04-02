import { Component, Injectable, Input, OnInit, VERSION } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { DateRange, MatDateRangePicker, MatDateRangeSelectionStrategy, MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonType, Column, MyViewsTableData } from '@tempus/client/shared/ui-components/presentational';

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
  @Input() from !: Date;
  @Input() thru !: Date;
  prefix = 'onboardingResourceTimesheet';
  startDate2 = "";
  endDate2 = "";

  constructor(private translateService: TranslateService,
    private router: Router,
		private route: ActivatedRoute,) {
    const { currentLang } = translateService;
		translateService.currentLang = '';
		translateService.use(currentLang);
   }

   changed(picker: MatDateRangePicker<any>) {
    console.log("changed");
    console.log(this.from);
    console.log(this.thru);
    let startDate: Date = new Date(this.from);
    let startDate_string: string = startDate.toLocaleString();
    let endDate: Date = new Date(this.thru);
    let endDate_string: string = endDate.toLocaleString();
    this.startDate2 = startDate_string;
    this.endDate2 = endDate_string;
    //let new_StartDate: Date = new Date(this.from);
    //let startDate: string = new_StartDate.toLocaleString();
  }
  
  /*
  startDate: Date = new Date(this.from);
  startDate_string: string = this.startDate.toLocaleString();
  endDate: Date = new Date(this.thru);
  endDate_string: string = this.endDate.toLocaleString();*/

  displayedColumns: string[] = ['position', 'project', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'total'];
  dataSource = ELEMENT_DATA;

  //created dummy data for days of the week in table
  version = VERSION.full;
  formatsDateTest: string[] = ['fullDate'];
  dateNow: Date = new Date();

  ButtonType = ButtonType;

  ngOnInit(): void {
    
  }

  navigateToCreateNewView() {
		this.router.navigate(['./new'], { relativeTo: this.route });
	}

}
