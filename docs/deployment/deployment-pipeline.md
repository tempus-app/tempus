# Deployment

The app is hosted on Azure App Service and is run through a docker container. The image is hosted on dockerhub and is built and pushed on changes to the release branch. The database is ran through Azure and the application connects to the database through environment variables.

## Github Actions

To make changes to the deployment pipeline the github action file must be modified. The github action file can be found [here](../../.github/workflows/azure-publish.yml).

## Website

The website can be accessed through the azure link [here](https://cal-tempus.azurewebsites.net/signin).
