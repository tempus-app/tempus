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
