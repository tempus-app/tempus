## Components

### Card: tempus-card

- wrapper around Material UI card element with background, shadow and border radius applied

```
<tempus-card>
    <div>hi</div>
</tempus-card>
```

### Chip: tempus-chip

- wrapper around material UI chip, which takes in the following inputs:
  - `id` : skill (default), skill-dark, skill-light, skill-medium, skill-select
  - `typography`: subheading-1 (default) h1,h3,,body, mat-button (as defined in theme.scss)
  - `removable`: renders x icon to remove, defaults to false
  - `(onRemove)`: handle removal of chip (x closed)

```
<tempus-chip
    [removable]="false"
    id="skill-dark" typography="h1"
    (onRemove) = func(event)
/>
```

### Button: tempus-button

- wrapper around material UI button, with predefined style options for convenience:
  - `buttonType`: ButtonType [FILTER, EDIT, INVITE, CREATE_NEW_VIEW, DOWNLOAD_VIEW]
  - `color`: [primary, accent, warn]
  - `label`: button label string
  - `icon`: mat-icon name

Using `buttonType`:

```
<tempus-button
  [buttonType]="ButtonType.FILTER"
  color="primary"
  (click)="someEvent()">
</tempus-button>
```

Custom styling:

```
<tempus-button
  label="reject changes"
  color="warn"
  icon="cancel">
</tempus-button>
```

### Sidebar: tempus-sidebar

- side navbar based off of material UI sidenav. This is a persistent component that loads user name and email and handles navigation.
- tempus-sidebar is added to the router level to load components by route. Ensure that the css classes are applied as shown below to correctly display the sidebar.

```
<tempus-sidebar class="resource-shell">
  <div class="container">
    <router-outlet></router-outlet>
    <tempus-footer></tempus-footer>
  </div>
</tempus-sidebar>
```

- all routes that the sidebar tabs are highlighted for are defined within `paths`, where the base route is what is navigated to on tab click

```
	paths = [
		{
			tab: SidebarTab.MANAGE_RESOURCES,
			route: '/owner/manage-resources',
			base: true,
		},
		{
			tab: SidebarTab.MANAGE_RESOURCES,
			route: '/owner/view-resources',
		},
    ...
	];
```

### Stepper: tempus-stepper

- a stepper based off of material UI mat-stepper - it does not wrap step contents, rather it is used as a decoraitve header with navigation buttons for step.
- tempus-stepper takes in the following inputs:

  - `steps`: array of stepper labels
  - `color`: [primary, accent]

```

<tempus-stepper
[steps]="['Step 1', 'Step 2', 'Step 3', 'Step 4']"
color="primary">
</tempus-stepper>

```

### Table: tempus-table

- wrapper around material table to provide reusability around it
- `tableColumns`: the columns to be generated in the table
- `tableData`: the data to be provided in the table

```

<tempus-table
[tableColumns]="tableColumns"
[tableData]="data">
</tempus-table>

```

`tableColumns` and `tableData` should reflect each other like so:

```

data = [
{
name: 'Gabriel Granata',
email: 'gabriel.granata@hotmail.com',
},
{
name: 'Mustafa Ali',
email: 'mustafa.ali@email.com',
},
{
name: 'Georges Chamoun',
email: 'georges.chamoun@email.com',
},
]

tableColumns: Array<Column> = [
{
columnDef: 'name',
header: 'Name',
cell: (element: Record<string, any>) => `${element['name']}`
},
{
columnDef: 'email',
header: 'Email',
cell: (element: Record<string, any>) => `${element['email']}`
},
]

```

All table data must extend off of `TableDataModel` but one can make custom models as needed.
The table component actually renders the cell value as html so one can put html tags instead of just strings. One can optionally pass an icon to a table data element to display as a mat icon alongside a list of columns to show the icon on. Similarly, one can pass a url to a table data element alongside a list of columns to render as a clickable link.
