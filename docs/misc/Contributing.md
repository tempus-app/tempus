# Contributing - Miscellaneous items

## Assets
Assets shared by the backend, such as template files, are located in `libs/api/shared/api-assets`. Frontend assets, such as icons and internationalization files, are stored in `libs/client/shared/ui-assets`. To add a new asset, create a directory for the file type if required, such as `api-assets/src/lib/assets/images`, and add the file. 

## Shared client utilities
Functions that are frequently used across the client such as formatting and validation checks can be added to `libs/client/shared/util/src/lib/shared-util.ts`

Example:

```
export function formatAddress(country: string, state: string, city: string) {
    return `${city}, ${state}, ${country}`;
}
```

Import into the required component:
  
`import { formatAddress } from '@tempus/client/shared/util';`

## GitHub Actions
The GitHub Actions CI pipeline script can be modified to add, remove or update steps as we further our development and introduce new QA practices. The script can be found in the root project directory, `tempus/.github/workflows/github-action.yml`. Please refer to [GitHub Docs](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions) for core concepts and syntax.

## PR Template
Our PR template, `tempus/.github/pull_request_template.md`, is a markdown file that auto populates PR descriptions upon creation. The acceptance criteria can be extended as we further development.