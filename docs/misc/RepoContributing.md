# Contribute to the Tempus Repository

Please follow the steps below to ensure that your contributions are inline with our naming conventions and QA practices before you push to the tempus repository.

## 1. Project naming conventions

### Client Modules

- Modules within `libs/client/onboarding-client`should be prefixed with `OnboardingClient` like so: `OnboardingClientFeatureSignInModule`
- Modules within `libs/client/shared` should be prefixed with `ClientShared` like so: `ClientSharedUiComponentsPresentationalModule`
- Ensure these file names are as brief as possible and reflected in library files as well as `angular.json`

### General

- Directory names are in kebab-case
- File names are in camelCase

## 2. Git conventions

Ensure your issue, branch, commits and PR names follow the patterns detailed in our [wiki.](https://github.com/tempus-app/wiki/wiki/General-Conventions)

## 3. Linting

Run a lint check on the affected files as described in the [Lint doc](../Lint.md) and resolve any errors.

## 4. PR structure

The PR description uses our [template.](../../.github/pull_request_template.md) Upon creation, ensure that the the contents are populated and the checklist is crossed off where appropriate.
