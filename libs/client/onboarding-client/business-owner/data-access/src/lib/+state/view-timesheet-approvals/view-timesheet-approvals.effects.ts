import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { BusinessOwnerState } from '..';
import { OnboardingClientTimesheetsService } from '@tempus/client/onboarding-client/shared/data-access';
import { getAllTimesheetsBySupervisorId, getAllTimesheetsBySupervisorIdSuccess, getAllTimesheetsBySupervisorIdFailure, updateTimesheetStatusAsSupervisor, updateTimesheetStatusAsSupervisorSuccess, updateTimesheetStatusAsSupervisorFailure } from './view-timesheet-approvals.actions';

@Injectable()
export class TimesheetEffects {
	constructor(
		private readonly actions$: Actions,
		private store: Store<BusinessOwnerState>,
        private timesheetService: OnboardingClientTimesheetsService,
	) {}

    getAllTimesheets$ = createEffect(() => 
        this.actions$.pipe(
            ofType(getAllTimesheetsBySupervisorId),
            switchMap(data =>
                this.timesheetService.getTimesheetsBySupervisorId(data.supervisorId, data.pageNum, data.pageSize).pipe(
                    map(res => {
                        return getAllTimesheetsBySupervisorIdSuccess({timesheets: res.timesheets, totalTimesheets: res.totalTimesheets});
                    }),
                    catchError(error => of(getAllTimesheetsBySupervisorIdFailure({error }))),
                ),
            ),
        ),
    );

    updateTimesheetStatus$ = createEffect(() => 
      this.actions$.pipe(
        ofType(updateTimesheetStatusAsSupervisor),
        switchMap(data =>
            this.timesheetService.updateTimesheetStatusAsSupervisor(data.timesheetId, data.approveTimesheetDto).pipe(
                map(_ => {
                    return updateTimesheetStatusAsSupervisorSuccess();
                }),
                catchError(error => of(updateTimesheetStatusAsSupervisorFailure({ error }))),
            ),
        ),
     ),
    );
}
