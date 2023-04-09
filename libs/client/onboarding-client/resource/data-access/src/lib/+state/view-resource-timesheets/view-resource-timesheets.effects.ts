import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { OnboardingClientTimesheetsService } from '@tempus/client/onboarding-client/shared/data-access';
import { ResourceState } from '..';
import {
	getAllTimesheetsByResourceId,
	getAllTimesheetsByResourceIdSuccess,
	getAllTimesheetsByResourceIdFailure,
} from './view-resource-timesheets.actions';

@Injectable()
export class TimesheetEffects {
	constructor(
		private readonly actions$: Actions,
		private store: Store<ResourceState>,
		private timesheetService: OnboardingClientTimesheetsService,
	) {}

	getAllTimesheets$ = createEffect(() =>
		this.actions$.pipe(
			ofType(getAllTimesheetsByResourceId),
			switchMap(data =>
				this.timesheetService.getTimesheetsByResourceId(data.resourceId, data.pageNum, data.pageSize).pipe(
					map(res => {
						return getAllTimesheetsByResourceIdSuccess({
							timesheets: res.timesheets,
							totalTimesheets: res.totalTimesheets,
						});
					}),
					catchError(error => of(getAllTimesheetsByResourceIdFailure({ error }))),
				),
			),
		),
	);
}
