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

|         **Adding a view**          |
| :--------------------------------: |
|          Adding a library          |
|           Adding a shell           |
|          Creating a route          |
|    Adding an angular component     |
|          Using the store           |
| Using the shared component library |
|        Adding a translation        |
|            Adding tests            |

## Adding a View

First we must understand a view. A view is a collection of pages that share similar elements/functionality. For example under `libs/client/onboarding-client` we have views such as `business-owner`, `resource`, and `signup`. These are a collection of folders grouped together which require many pages but have similar a domain. The `business-owner` view for example would have pages that are required by the business owner such as managing and viewing resources pages. In general, these views each have a similar structure of `data-access`, `features`, and `shell` folders. `data-access` handles store related activities, `features` contains the pages, and the `shell` handles the routing. For more information regarding the structure refer to the frontend structure [document](./FileStructure.md).

## Adding a Library

Adding a library is crucial when adding major elements to the frontends. Typically you will need to do this when making a new shell, for example refer to to the following directory [libs/client/onboarding-client/business-owner/shell](../../libs/client/onboarding-client/business-owner/shell/). Another case occurs when adding features, for example refer to[libs/client/onboarding-client/business-owner/features](../../libs/client/onboarding-client/business-owner/features/). Libraries hold all the relevant code such as the html, css, and typescript needed to display and interact with a page. The following command describes how to generate a library:

```
npx nx generate @nrwl/angular:library --name=<library-name> --directory=<directory-path>
```

It is important that the directory path does not include libs in the beginning as nx already assumes generation starts under libs. For example to generate a library under `libs/client/onboarding-client/business-owner/feautres`, the command would be as follows.

```
npx nx generate @nrwl/angular:library --name=test --directory=client/onboarding-client/business-ownerfeatures/feature-test
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

The following is an example of generating a component under the create [create-credentials page](../../libs/client/onboarding-client/signup/features/feature-create-credentials/):

```
npx nx generate @schematics/angular:component --name=test-component --project=onboarding-client-signup-feature-create-credentials
```

## Adding a Shell/Creating a route

A shell component is used for routing and is crucial when setting up routes for a collection of new pages. Currently we have an overall shell that handles routes for all views. Then we have to subshells that handles routing for the signup flow (found under `libs/client/onboarding-client/signup/shell`), the business owner views (found under `libs/client/onboarding-client/business-owner/shell` ), and the resource views (found under `libs/client/onboarding-client/resource/shell`). To add a shell it is identical to creating a library with the name being shell and the directory path differing (as described above). However, there is a bit of configuration to be done within the library. Once the shell is generated, generate an angular component also called shell as described in the above section `Adding an angular component`. In the module file, the routes have to be setup. The module file can be found by browsing under the directory and searching for a file that matches the pattern `<lib-name>-feature-shell.module.ts`. In that file setup, first setup the file as follows.

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

Some elements have stubbed in as it will change depending on how and where you change the component. For example `<ViewNameDataAccess>` is the data access folder typically under a view. This is where details of the store are located. The shell component is that angular component that was mentioned before. This also has the same name as the library shell, however it is where html and typescript can be defined so all components loaded under the routes can have common elements. The routes is an array as there can be multiple routes with a shell which make sense since it is a collection of pages. The path can be specified so when a user is on that route, a module can be loaded through the `loadchildren` section of the array element. The `loadChildren` section takes in a module (which is typically a page), and displays it on that route. One note is that the route typically has prefixes but that is defined in the root level shell component, which controls routing for the entire frontend under `libs/client/onboarding-client/shell`. For an example refer to the following [file](../../libs/client/onboarding-client/business-owner/shell/src/lib/onboarding-client-business-owner-feature-shell.module.ts).

## Using the Store

The store for a view is configured under the `data-access` folder. To find more information about using the store and what the store is, refer to the following [document](./Store.md).

## Using the Modal Service 

To use a modal when popups are required, use the modal service which is described in this [document](./ModalService.md).

## Adding a Translation

We do not hardcode english into the HTML or Typescript but rather use a translation service. Information on using and implementing the translation service can be found [here](./Translations.md).

## Using the shared Angular Components

We have developed our own reusable components to be used throughout the application. More information on the components themselves can be found [here](./Components.md). The components themselves can be found under `client/libs/onboarding-client/shared/ui-components`. To import the `input-components` which include elements such as the text input and textarea, we must use the following imports in our module file (typically found under `<view-name>/features/<feature-name>/src/lib/<feature-name>-module.ts`). An example to demonstrate where the components must be imported can be found [here](../../libs/client/onboarding-client/resource/features/feature-profile/src/lib/onboarding-client-resource-feature-profile.module.ts).

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

## Adding a Test

Each angular component is generated with a `.spec.ts` file. This is the test file and tests can be added here. Generally for the frontend we test the component display, typescript functions, and DOM interactions.
