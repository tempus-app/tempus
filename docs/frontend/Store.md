## NgRx Store

[NgRx Store](https://ngrx.io/guide/store) is a reactive state management library that provides support for Angular applications to exchange data across components through a single store. It is built on the [Redux](https://redux.js.org/tutorials/fundamentals/part-1-overview) pattern with the following concepts:

1. Store - a central store that holds the application state, which can be accessed and updated by Angular components and services.
2. [Actions](https://ngrx.io/guide/store/actions) - methods dispatched by components when an event is fired. Actions are used to update the state of a Store through reducers.
3. [Reducers](https://ngrx.io/guide/store/reducers) - pure functions that handle state transitions by listening to the dispatched action, updating the state and returning the new state object.
4. [Selectors](https://ngrx.io/guide/store/selectors) - pure functions that return data from a slice of the store relevant to the calling component or service.
5. [Effects](https://ngrx.io/guide/effects) - perform side effects like fetching data through HTTP and calling external services. Effects listen for actions, perform a side effect and trigger reducers to perform a state change.

## Create a new NgRx feature module

---

The state should be managed from a seperate library to allow access to components across the application.

- Create an Angular library for data-access

  `nx g @nrwl/angular:lib data-access`

- Use the Nx [NgRx schematic](https://nx.dev/guides/misc-ngrx) to generate NgRx feature states. This will add actions, effects, reducers and selectors files of the state to an existing library, as well as update the feature module to register the feature states. By convention, the feature name should be in the plural form, such as 'links'.

  `nx g @nrwl/angular:ngrx <feature state name> --module=<path to the NgModule where the feature state will be registered> --directory +state/<feature state name> --no-interactive`

States shared across pages, such as `AuthState`, should be placed under `libs\client\onboarding-client\shared\data-access\src\lib\+state`. Page-specific states should be placed within the `data-access` directory of its own bounded-context.

**NOTE:** States and actions can be observed through the [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) extension.

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

By convention, action types should be follow the format of `[Source] Action Name`. The action is usually dispatched from a component page or a serivce, such as 'Signup Resume Upload Page'.

```
import { createAction, props } from '@ngrx/store';

export const createResumeUpload = createAction(
	'[Signup Resume Upload Page] Create Resume Upload',
	props<{ resume: File }>(),
);
```

---

### Reducers

Reducers help transition between states when an action is dispatched. A reducer is a pure function that takes the value of the initial (previous) state and the action dispatched as parameters. The reducer will consume the actions and its payload according to its action type, process any necessary state changes and return a new state object with the changes applied.

Define the initial state:

```
export interface ResourceState {
	createResourceData: ICreateResourceDto;
	credentialsCreated: boolean;
	resumeUploadCreated: boolean;
	userDetailsCreated: boolean;
	workExperienceDetailsCreated: boolean;
	trainingAndSkillDetailsCreated: boolean;
	uploadedResume: File | null;
	error: Error | null;
	status: AsyncRequestState;
}

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

Reducers can reflect the status of API calls through modifying the state status through the shared enum `AsyncRequestState` and tracking errors. This is done when actions reporting success/failure are dispatched.

```
	on(ResourceActions.createResourceSuccess, state => ({
		...state,
		status: AsyncRequestState.SUCCESS,
		error: null,
	})),
	on(ResourceActions.createResourceFailure, (state, { error }) => ({
		...state,
		status: AsyncRequestState.ERROR,
		error,
	})),
```

---

### Selectors

Selectors are pure functions that query the Store and return slices of state data that components can consume. The state is a tree of properties built by various feature models across the application; selectors allow us to access just a slice of the state relevant to the Angular component.

The method `createFeatureSelector` can be used to return a top level feature state:

```
import { createFeatureSelector } from '@ngrx/store';

export const selectSignupState = createFeatureSelector<SignupState>(SIGNUP_FEATURE_KEY);
```

`createSelector` is used to return some of the data from the state:

```
import { createSelector } from '@ngrx/store';

export const selectResource = createSelector(selectSignupState, (state: SignupState) => state[RESOURCE_FEATURE_KEY]);

export const selectUploadedResume = createSelector(selectResource, (state: ResourceState) => state.uploadedResume);
```

---

### Effects

Effects isolate side effects from components by interacting with external resources through services which reducers do not, such as fetching data, that components need not be aware of. Using Effects with the store limits the responsibility of components to strictly selecting state and dispatching actions. Effects listen to actions dispatched from the store, filter them based on the type of action they're interested in, perform synchronous/asynchronous tasks and return a new action.

Create an injectable service Effects class. The `createResource$` effect for example listens for dispatched actions and on the action `createResource`, calls the injected service `OnboardingClientResourceService`, which on `Resource` creation, dispatches the success action, or catches the error on failure.

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

A components interaction with the store is limited to `select()` and `dispatch()` calls. The store uses `select()` to return a slice of state data through the Store object, which is an Observable. This allows components to monitor changes of state. The component itself should avoid service calls as they are handled through actions and effects.

Import RxJs and the relevant feature states. Define the slice of store in the component constructor. We can then set values of `firstName`,`lastName`, and `resume` from the store through the `select()` method.

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

The `dispatch()` method allows components to dispatch actions to the store like so:

```
this.store.dispatch(resetLinkState());
```
