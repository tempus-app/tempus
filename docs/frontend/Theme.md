## Themes

Please refer to our [wiki](https://github.com/tempus-app/wiki/wiki/Guide-to-Angular-Material-Theming).

## Usage

- To fetch colors from palettes, use the style variables in `variables.scss`. **Do not import `theme.scss` directly!**

1. Import file **after** any `@use` imports:

```
@use '@angular/material' as mat;
@use 'sass:map';
@import 'variables';
```

2. Use variables to style:

```
#skill-select {
  background-color: $primary-700;
}
```
