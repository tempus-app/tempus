import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Link } from '@tempus/shared-domain';
import { of, switchMap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { OnboardingClientLinkService } from '@tempus/client/onboarding-client/shared/data-access';
import { Injectable } from '@angular/core';
import { loadLinkData, loadLinkDataFailure, loadLinkDataSucess } from './link.actions';

@Injectable()
export class LinkEffects {
	constructor(private readonly actions$: Actions, private linkService: OnboardingClientLinkService) {}

	loadLink$ = createEffect(() =>
		this.actions$.pipe(
			ofType(loadLinkData),
			switchMap(action =>
				this.linkService.loadLink(action.linkToken).pipe(
					map((link: Link) => loadLinkDataSucess({ link })),
					catchError(error => of(loadLinkDataFailure({ error }))),
				),
			),
		),
	);
}
