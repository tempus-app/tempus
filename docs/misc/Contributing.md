# Contributing - Miscellaneous items

## Shared utilities
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

 PR structures
 Naming conventions
 Linting (lint to linting.md)