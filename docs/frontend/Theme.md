## Themes

Please refer to our [wiki](https://github.com/tempus-app/wiki/wiki/Guide-to-Angular-Material-Theming).

## Styles
- Abstracts: fonts, colors, typography and other variables  
- Components: styling for particular components (e.g buttons, form fields)
  
### Usage
1. Import the relevant helper file:
```
@use 'abstracts/helper' as abs;
```  

  2. Use variables:
    ```
    .mat-stepper-horizontal-line {
      border-top-color: abs.$primary-300;
    }
    ```
- Use mixins:
 ```
 @use 'components/helper' as c;

 .secondary {
   @include c.tempus-form(white);
 }
 ```
