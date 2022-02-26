## Linting

Automatic Linting is used within the repository to allow for cleaner code.

## Tools

Prettier: see config @ .prettierrc
- Has priority over ESLint for formatting choices

ESLint: see config @ .eslintrc.json
- Eslint extends airbnb's style guide along with typescript recommended

ESLint has been modified to include prettier errors

## Set up

Eslint and Prettier have both been set up in the repository, to allow for optimal coding
- install and enable the [ESlint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) on vsCode
- in your .vscode/settings.json, add the following:

```
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },

  "eslint.validate": ["typescript"]
```
These steps allow you to view warnings as you code, and allow autofixing of errors when you save a file

## Running Linters

To run a lint check on the workspace

``npx nx run-many --all --target=lint``
- optionally add ``--fix`` to fix the errors

To run a lint check on a project (api-project, api-auth etc.)

``npx nx run <project>:lint``