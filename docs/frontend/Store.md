## NgRx Store

[NgRx Store](https://ngrx.io/guide/store) is a reactive state management library that provides support for Angular applications to exchange data across components through a single store. It is built on the [Redux](https://redux.js.org/tutorials/fundamentals/part-1-overview) pattern with the following concepts:

1. Store - a central store that holds the application state, which can be accessed and updated by Angular components.
2. [Actions](https://ngrx.io/guide/store/actions) - methods dispatched by components when an event is fired. Actions are used to update the state of a Store through reducers.
3. [Reducers](https://ngrx.io/guide/store/reducers) - pure functions that handle state transitions by performing the dispatched action, updating the state and returning the new state object. Components can subscribe to a [selector](https://ngrx.io/guide/store/selectors) to get the new value of the state.

## Create a new NgRx feature module

---

The state should be managed from a seperate library to allow access to components across the application.

- Create an Angular library for data-access

  `nx g @nrwl/angular:lib data-access`

- Use the Nx [NgRx schematic](https://nx.dev/guides/misc-ngrx) to generate NgRx feature states. This will add actions, effects, reducers and selectors files of the state to an existing library, as well as update the feature module to register the feature states.

  `nx g @nrwl/angular:ngrx <feature state name> --module=<path to the NgModule where the feature state will be registered> --directory +state/<feature state name> --no-interactive`

Navigate to `data-access/src/lib/+state` and create a file at the root to hold the state that will be used across components.

1. Import from ngrx/store and relevant feature states:

```
import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { linkReducer, LinkState, LINK_FEATURE_KEY } from './link/link.reducers';
```

2. Define the feature key:

`export const SIGNUP_FEATURE_KEY = 'signup';`

This key will be tied to the reducer and used when registering the feature in the `module.ts` file:

```
@NgModule({
	imports: [
		CommonModule,
		StoreModule.forFeature(SIGNUP_FEATURE_KEY, reducers),
		EffectsModule.forFeature([LinkEffects, ResourceEffects]),
	],
})
```

3. Define the slice of state as an interface:

```
export interface SignupState {
	[LINK_FEATURE_KEY]: LinkState;
	[RESOURCE_FEATURE_KEY]: ResourceState;
}
```

Export a map of all reducers:

```
export const reducers: ActionReducerMap<SignupState> = {
	[LINK_FEATURE_KEY]: linkReducer,
	[RESOURCE_FEATURE_KEY]: resourceReducer,
};
```

Define a selector to access the value of the state:

`export const selectSignupState = createFeatureSelector<SignupState>(SIGNUP_FEATURE_KEY);`

4. Ensure state logic is exposed in `index.ts`:

```
export * from './lib/onboarding-client-signup-data-access.module';
export * from './lib/+state';
```

---

### Actions

Actions define what the store section should be able to do through methods which are dispatched by the calling component. The type - a string describing the action being dispatched - and an optional payload of the NgRx Action are defined with the following format:

```
import { createAction, props } from '@ngrx/store';

export const createResumeUpload = createAction(
	'[Signup Resume Upload Page] Create Resume Upload',
	props<{ resume: File }>(),
);
```

---

### Reducers

Reducers help transition between states when an action is dispatched. A reducer is a pure function that takes the value of the initial (previous) state and the action dispatched as parameters. The action type and payload will be analyzed and the appropriate action will be dispatched, and a new state object will be returned with the payload object.

Define the initial state:

```
export const initialState: ResourceState = {
	createResourceData: { roles: [RoleType.AVAILABLE_RESOURCE] } as ICreateResourceDto,
	credentialsCreated: false,
	resumeUploadCreated: false,
	userDetailsCreated: false,
	workExperienceDetailsCreated: false,
	trainingAndSkillDetailsCreated: false,
	uploadedResume: null,
	error: null,
	status: AsyncRequestState.IDLE,
};
```

Create a reducer function with `createReducer` that takes in the initial state and associations between actions and state changes, generated through `on`.

```
import { createReducer, on } from '@ngrx/store';
import * as ResourceActions from './createResource.actions';

export const resourceReducer = createReducer(
	initialState,
	on(ResourceActions.createResumeUpload, (state, { resume }) => ({
		...state,
		resumeUploadCreated: true,
		uploadedResume: resume,
	})),
	on(
		ResourceActions.createUserDetails,
		(state, { firstName, lastName, phoneNumber, linkedInLink, githubLink, otherLink, location, profileSummary }) => ({
			...state,
			userDetailsCreated: true,
			createResourceData: {
				...state.createResourceData,
				firstName,
				lastName,
				phoneNumber,
				linkedInLink,
				githubLink,
				otherLink,
				location,
				profileSummary,
			},
		}),
	),
    ...
);
```

---

### Selectors

Selectors are pure functions that query the Store and return slices of state data that components can consume. The state is a tree of properties built by various feature models across the application; selectors allow us to access just a slice of the state relevant to the Angular component.

The method `createFeatureSelector` can be used to return a top level feature state:

```
import { createFeatureSelector } from '@ngrx/store';

export const selectSignupState = createFeatureSelector<SignupState>(SIGNUP_FEATURE_KEY);
```

`createSelector` is used to return some of the date from the state:

```
import { createSelector } from '@ngrx/store';

export const selectResource = createSelector(selectSignupState, (state: SignupState) => state[RESOURCE_FEATURE_KEY]);

export const selectUploadedResume = createSelector(selectResource, (state: ResourceState) => state.uploadedResume);
```

---

### Effects

[Effects](https://ngrx.io/guide/effects) listen to actions dispatched from the store and can dispatch new actions, as well as isolate side effects from components by handling external data and API interactions.

Create an injectable service Effects class. The `createResource$` effect for example listens for dispatched actions and on the action `createResource`, calls the service `OnboardingClientResourceService`, which on `Resource` creation, dispatches the success action, or catches the error on failure.

```
@Injectable()
export class ResourceEffects {
	constructor(
		private readonly actions$: Actions,
		private store: Store<SignupState>,
		private resourceService: OnboardingClientResourceService,
	) {}

	createResource$ = createEffect(() =>
		this.actions$.pipe(
			ofType(createResource),
			withLatestFrom(this.store.select(selectResourceData)),
			switchMap(([action, createResourceData]) =>
				this.resourceService.createResource(createResourceData).pipe(
					map(() => createResourceSuccess()),
					catchError(error => of(createResourceFailure({ error }))),
				),
			),
		),
	);
}
```

Register effects in the `module.ts` file:

```
@NgModule({
	imports: [
		CommonModule,
		StoreModule.forFeature(SIGNUP_FEATURE_KEY, reducers),
		EffectsModule.forFeature([LinkEffects, ResourceEffects]),
	],
})
```

## Use NgRx in Angular components

Import RxJs and the relevant feature states. Define the slice of store in the component constructor. We can then set values of `firstName`,`lastName`, and `resume` from the store.

```
import { Store } from '@ngrx/store';
import {
	createResource,
	resetCreateResourceState,
	resetLinkState,
	selectResourceData,
	selectResourceStatus,
	selectUploadedResume,
	SignupState,
} from '@tempus/client/onboarding-client/signup/data-access`;

export class ReviewComponent implements OnInit {

	firstName = '';
	lastName = '';
    resume: File | null = null;

    constructor(
		private store: Store<SignupState>,
        ...
	) {}

	ngOnInit(): void {
		this.store
			.select(selectResourceData)
			.pipe(take(1))
			.subscribe(resData => {
				this.firstName = resData?.firstName;
				this.lastName = resData?.lastName;
			});
		this.store
			.select(selectUploadedResume)
			.pipe(skip(1), takeUntil(this.$destroyed))
			.subscribe(resumeData => {
				this.resume = resumeData;
			});
	}
}
```
