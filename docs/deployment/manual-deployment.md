# Manual Deployment

In the case the pipeline fails the app can be deployed manually through dockerhub and azure cli. The following steps detail the process.

## Build and Push the Docker Image

First the production client and api must be built in the directory before the docker image can be built. This can be done by running the following command:

```
npm run build:onboarding-api && npm run build:client:prod
```

Once that is built the docker image must be built. Please ensure that you are logged into the `tempusottawa` dockerhub account. Here are the steps to build and push the image. Please note that the image will take some time to build.

```
docker build -t "tempusottawa/tempus:latest" -f Dockerfile.onboarding.prod .
docker push  "tempusottawa/tempus:latest"
```

## Deploying the application to Azure App Service

Once the image has been successfuly pushed to dockerhub the app must be deployed from the azure cli. The steps to be download the `Azure CLI` are detailed on this [webpage](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli).

Once installed run the following command if deploying the application for the first time.

```
az webapp create --resource-group myResourceGroup --plan tempus --name cal-tempus --multicontainer-config-type compose --multicontainer-config-file azure-compose.yml
```

To update an already deployed application run the following command.

```
az webapp config container set --resource-group myResourceGroup --name cal-tempus --multicontainer-config-type compose --multicontainer-config-file azure-compose.yml
```

Following this the application will download the new docker image and the live [website](https://cal-tempus.azurewebsites.net/signin) will be updated in a few minutes. You may check the logs for the deployment under `App Service --> Diagnose and solve problems --> Availability and Performance --> Application Logs --> Platform Logs`.
