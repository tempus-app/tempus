import { Component, Injectable, Input, OnInit, VERSION } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { DateRange, MatDateRangePicker, MatDateRangeSelectionStrategy, MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonType, Column, MyViewsTableData } from '@tempus/client/shared/ui-components/presentational';


@Component({
  selector: 'tempus-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss'],
  providers: [
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

  ButtonType = ButtonType;

  ngOnInit(): void {
    
  }

  navigateToCreateNewView() {
		this.router.navigate(['./new'], { relativeTo: this.route });
	}

}
