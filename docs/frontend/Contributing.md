# Contributing to the Frontend

This document details how to add and modify the frontend. To understand the file structure and layout of the frontend, refer to this [document](./FileStructure.md).

## Typical flows to Contribute

The flow to contribute will differ depending on the task to be done. Below, steps are described for typical flows that a user may encounter while trying to contribute. The following sections will explain the steps in greater detail.

|        **Modifying a page**        |
| :--------------------------------: |
|    Adding an angular component     |
| Using the shared component library |
|           Adding a test            |

|         **Adding a page**          |
| :--------------------------------: |
|          Adding a library          |
|    Adding an angular component     |
| Using the shared component library |
| Adding/Updating the shell routing  |
|           Adding a test            |

|         **Adding a Bounded Context**          |
| :--------------------------------: |
|          Adding a library          |
|           Adding a shell           |
|          Creating a route          |
|    Adding an angular component     |
|          Using the store           |
| Using the shared component library |
|        Adding a translation        |
|            Adding tests            |

## Adding a Bounded Context

First we must understand what a bounded context is. A bounded context is a collection of pages that share similar elements/functionality. For example under `libs/client/onboarding-client` we have bounded contexts such as `business-owner`, `resource`, and `signup`. These are a collection of folders grouped together which require many pages but have similar a domain. The `business-owner` bounded context for example would have pages that are required by the business owner such as managing and viewing resources pages. In general, these  bounded contexts each have a similar structure and contains the `data-access`, `features`, and `shell` folders. `data-access` handles store related activities, `features` contains the pages, and the `shell` handles the routing. For more information regarding the structure refer to the frontend structure [document](./FileStructure.md).

## Adding a Library

Adding a library is crucial when adding major elements to the frontends. Typically you will need to do this when making a new shell, for example refer to to the following directory [libs/client/onboarding-client/business-owner/shell](../../libs/client/onboarding-client/business-owner/shell/). Another case occurs when adding features, for example refer to [libs/client/onboarding-client/business-owner/features](../../libs/client/onboarding-client/business-owner/features/). Libraries hold all the relevant code such as the html, css, and typescript needed to display and interact with a page.  The following command describes how to generate a library:

```
npx nx generate @nrwl/angular:library --name=<library-name> --directory=<directory-path>
```

It is important that the directory path does not include libs in the beginning as nx already assumes generation starts under libs. For example to generate a library under `libs/client/onboarding-client/business-owner/feautres`, the command would be as follows.

```
npx nx generate @nrwl/angular:library --name=test --directory=client/onboarding-client/business-ownerfeatures/feature-test
```

Typically after generating a library, the library name must be modified as the nx generated name is not entirely clear. The library has to be renamed to follow the format of the other libraries. This would include the folder itself, the files, and the reference in the `angular.json` file. Additionally, the translation service must be setup as part of this step, more details can be found in the [translation document](./Translations.md).

A feature itself also has routing configured. This is found in the `module.ts` file and contains information on the path it looks for. For example refer to the following [file](../../libs/client/onboarding-client/signup/features/feature-review-info/src/lib/onboarding-client-signup-feature-review-info.module.ts) which shows the routing configured for the `review` feature under the `signup` bounded context. We can see that the router is imported and configured in the `@NgModule` in the snippet below. This is important to do as well in the module file otherwise the angular router will not be able to load the component. 

```
import { RouterModule } from '@angular/router';
...
...

@NgModule({
	imports: [
		CommonModule,
		...,
		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				component: ReviewComponent,
			},
		]),
		TranslateModule.forChild({
			loader: {
				provide: TranslateLoader,
				useFactory: createTranslateLoader,
				deps: [HttpClient],
			},
			isolate: false,
			extend: true,
		}),
	],
	declarations: [ReviewComponent],
})
export class OnboardingClientSignupFeatureReviewInfoModule {}

```

## Adding an Angular Component

A component can be generated either through nx or angular. To generate a component through angular the component name and project must be specified. The project is typically a folder under the `/libs/client/onboarding-client/` folder. To find a list of projects to ensure you are generating the component in the right location, please refer to the [angular.json](../../angular.json) file found in the root directory of the repository. The command to generate a component through angular is as follows:

```
ng g component <component-name> --project=<project-name> --export
```

Alternatively a component can be generated through nx as follows:

```
npx nx generate @schematics/angular:component --name=<component-name>  --project=<project-name>
```

The following is an example of generating a component under the [create-credentials page](../../libs/client/onboarding-client/signup/features/feature-create-credentials/):

```
npx nx generate @schematics/angular:component --name=test-component --project=onboarding-client-signup-feature-create-credentials
```

## Adding a Shell/Creating a route

A shell component is used for routing and is crucial when setting up routes for a collection of new pages. Currently we have an overall shell that handles routes for all bounded contexts. Then we have to subshells that handles routing for the signup flow (found under `libs/client/onboarding-client/signup/shell`), the business owner views (found under `libs/client/onboarding-client/business-owner/shell` ), and the resource views (found under `libs/client/onboarding-client/resource/shell`). To add a shell it is identical to creating a library with the name being shell and the directory path differing (as described above). However, there is a bit of configuration to be done within the library. Once the shell is generated, generate an angular component also called shell as described in the above section `Adding an angular component`. For a clearer example refer to the following [directory]( ) which shows the angular shell component in the library shell. In the module file, the routes have to be setup. The module file can be found by browsing under the directory and searching for a file that matches the pattern `<lib-name>-feature-shell.module.ts`. Additionally, the translation service may be a part of this step, more details can be found in the [translation document](./Translations.md). In that file, first setup the file as follows.

```
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { <ViewNameDataAccess> } from '@tempus/client/onboarding-client/<ViewName>/data-access';
import { AuthGuard } from '@tempus/client/onboarding-client/shared/guards';
import { <ShellComponent> } from './shell/<ShellComponent>-feature-shell.component';

const routes: Routes = [
	{
		path: '',
		component: <ShellComponent>,
		children: [
			{
				path: '',
				pathMatch: 'full',
				canLoad: [AuthGuard],
				canActivate: [AuthGuard],
				loadChildren: () =>
					import('@tempus/onboarding-client/<feautre-to-be-display-path>').then(
						m => m.<feature-to-be-displayed-component>,
					),
			},
		],
	},
];

@NgModule({
	declarations: [<ShellComponent>],
	imports: [CommonModule, RouterModule.forChild(routes), <ViewNameDataAccess>],
})
export class <ViewShellModule> {}
```

Some elements have stubbed in as it will change depending on how and where you change the component. For example `<ViewNameDataAccess>` is the data access folder typically under a view. This is where details of the store are located. The shell component is that angular component that was mentioned before. This also has the same name as the library shell, however it is where html and typescript can be defined so all components loaded under the routes can have common elements. The state in the data-access folder is relevant only to that bounded context and sometimes a bounded context may not even require a state so the `<ViewNameDataAccess>` may not exist. 

The routes is an array as there can be multiple routes within a shell. The path can be specified so when a user is on that route, a module can be loaded through the `loadChildren` section of the array element. The `loadChildren` section takes in a module (which is typically a page), and displays it on that route. One note is that the route typically has prefixes but that is defined in the root level shell component, which controls routing for the entire frontend under `libs/client/onboarding-client/shell`. For an example refer to the following [file](../../libs/client/onboarding-client/business-owner/shell/src/lib/onboarding-client-business-owner-feature-shell.module.ts).

The guards specified in the routes are can vary depending on the route itself. The route itself may not need a guard or require a different one than the one shown in the example. 

## Using the Store

The store for a bounded context is configured under the `data-access` folder. To find more information about using the store and what the store is, refer to the following [document](./Store.md).

## Using the Modal Service 

To use a modal when popups are required, use the modal service which is described in this [document](./ModalService.md).

## Adding to the styles 
In order to modify to the styles, refer to this [document](./Theme.md) on how to add and edit the styling.

## Adding a Translation

We do not hardcode english into the HTML or Typescript but rather use a translation service. Information on using and implementing the translation service can be found [here](./Translations.md).

## Using the shared Angular Components

We have developed our own reusable material ui components to be used throughout the application. More information on the material ui components themselves can be found [here](./Components.md). The components themselves can be found under `client/libs/client/shared/ui-components`. An example to demonstrate where the components must be imported can be found [here](../../libs/client/onboarding-client/resource/features/feature-profile/src/lib/onboarding-client-resource-feature-profile.module.ts). These components are small reusable components that should be used when either capturing basic user information or presenting data through cards, chips, etc. 

To import the `input-components` which include elements such as the text input and textarea, we must use the following imports in our module file (typically found under `<bounded-context-name>/features/<feature-name>/src/lib/<feature-name>-module.ts`). 

```
import { ClientSharedUiComponentsInputModule } from '@tempus/client/shared/ui-components/input';
```

To import the presentational components such as the buttons or card, use the following import:

```
import { ClientSharedUiComponentsPresentationalModule } from '@tempus/client/shared/ui-components/presentational';
```

To import persistent components such as the side, use the following import:

```
import { ClientSharedUiComponentsPersistentModule } from '@tempus/client/shared/ui-components/persistent';
```

We also have components that are not basic material components but more complex components for data display or data input that are used throughout the app. This can be found under `libs/client/onboarding-client/shared/ui-components/`. The two folders within this directory describe the different components that can be imported from this shared component library. 

The `libs/client/onboarding-client/shared/ui-components/inout/resource-information` folder contains components that group many form fields together to build a component form for related information. For example this [personal-information component](../../libs/client/onboarding-client/shared/ui-components/input/resource-information/src/lib/personal-information/) is used to allow users to enter their personal information through a series of fields requiring their first name, last name, etc. For a concrete example it is used in the signup flow under the [my-info-one page](../../libs/client/onboarding-client/signup/features/feature-myinfo-one/src/lib/myinfoone/). It is imported as follows:

```
import { ClientSharedInputResourceInformationModule } from '@tempus/client/onboarding-client/shared/ui-components/input/resource-information';
```

The other type of components found in this folder are data display components. These components are used to display user information captured from the signup flow, or from the database when user's wish to access and view their profile. These components should be used when displaying a greater deal of information about the user such as their personal information, education, experience, etc. This is found under the `libs/client/onboarding-client/shared/ui-components/presentational/resource-display` folder. It is used within the [review page](../../libs/client/onboarding-client/signup/features/feature-review-info/src/lib/review/). It is imported as follows:

```
import { ClientSharedPresentationalResourceDisplayModule } from '@tempus/client/onboarding-client/shared/ui-components/presentational/resource-display';
```


## Adding a Test

Each angular component is generated with a `.spec.ts` file. This is the test file and tests can be added here. Generally for the frontend we test the component display, typescript functions, and DOM interactions.
