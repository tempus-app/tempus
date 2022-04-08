![workflow](https://github.com/tempus-app/tempus/actions/workflows/github-action.yml/badge.svg)

<p align="center">

<img src="./docs/assets/../screenshots/tempus_logo_1.png" width="80" height="80" style="{text-align:center}">
</p>


# Tempus 


# Table Of Contents
- [🎯  Motivation & Project Description](#--motivation--project-description)
  - [⚙️  Core Features](#️--core-features)
    - [🌗  Phase 1 (Jan-April 2022)](#--phase-1-jan-april-2022)
    - [🌕  Phase 2 (September-April 2022)](#--phase-2-september-april-2022)
- [🌵 Contributors](#-contributors)
- [🧰 Installation + Running](#-installation--running)
    - [Docker Set Ump](#docker-set-ump)
    - [Local Set Up](#local-set-up)
- [🛣️ Project Management](#️-project-management)
- [🎨 UI/UX Design](#-uiux-design)
- [🧠 Technical Knowledge](#-technical-knowledge)
  - [Database](#database)
  - [Backend](#backend)
  - [Frontend](#frontend)



# 🎯  Motivation & Project Description 

Tempus is a application built for CAL & Associates, an an enterprise resource mangement company, who scouts and hires resources to fuifil their clients (banks etc.) needs. Prior to Tempus, CAL undertook the manual work of reviewing the resources, building standardized resumes, and handling the onboarding proccess and project assignment for their resources, losing time. 

Tempus aims to smoothen this proccess by allowing resources to build profiles within the application, and for CAL to invite, manage, review and and assign resource to CAL's Client projects.


## ⚙️  Core Features

### 🌗  Phase 1 (Jan-April 2022)
- Invite Resource to Application
- Business Owner + Resource sign up flow
- Resource Profile Page - View & Edit Profiles
- Download Standardized Resumes for Resources
- Resource Profile Approval Flow
    - Business Owner can reject/approve profile changes

### 🌕  Phase 2 (September-April 2022)

- Resume Parsing on sign up
- Discover Resources Pages (for business owners)
    - filter to find clients based on needs
- Support for multiple Profile Versions (Views)
- Office 365 Integration (connect to CAL accounts)

 # 🌵 Contributors

This project was build by: 
 - Afrah Ali
 - Aman Riat
 - Gabriel Granata
 - Georges Chamoun
 - Mustafa Ali
 - Ruwani De Alwis


# 🧰 Installation + Running

There are two ways to run the <b>backend</b> application, using docker, and building the components of the app locally. Docker does heavily smoothen set up, however, it does take longer to build,load and will consume more of your CPU power. To run the client, you must follow the steps of the [local set up](#local-set-up), ignoring any database centric steps.

The first steps are general to both docker & non-docker set up.

1. Set up `.env` file in the root directory, following the [env.example file](/.env.example). Any value that is filled in the example file can be copied into the env variable as well for development purposes.
   
2. To set up the <b>test email server</b>, head over to [ethereal.com](https://ethereal.email), and create an account. After the account is filled, you can fill in the following env variables. To test if the emails have gone through properly, login to etheral and  check the messages tab.
    ```
    EMAIL_USERNAME=<username>
    EMAIL_PASSWORD=<password>
    EMAIL_ADDRESS=<username>
    ```
3. for Authentication, the follow values 


### Docker Set Ump

3. To run using docker, you must first install docker, following the instructions [here](https://docs.docker.com/get-docker/)
   
4. Additionally, if running through only docker, set the .env files as follows: 
    ```
    DB_HOST=postgres
    DB_PORT=5432
    DB_USERNAME=postgres
    DB_PASSWORD=<password>
    DB_NAME=postgres
    ```
If you want to support both docker & local development, it is recommended to set these variables directly in the [docker-compose.yml](docker-compose.yml) file.

5. After, docker is successufuly installed, you should be able to use the following commands to run/stop the containers
    - `docker-compose up`: starts up docker container for onboarding (our backend app), postgres database (image) and adminer (image)
      - to debug database issues, head over to http://localhost:8080, this should open up adminer which shows the postgres database
    - `docker-compose build`: rebuilds the containers, especially useful if there are new changes (that aren't reflected when running `docker-compose up`)
    - `docker-compose down`: stops and removed any of the running containers 

### Local Set Up

3. First install node, [here](https://nodejs.org/en/download/). The current version of node run is `v16.14.0`. To avoid unneeded modifications to package lock files, ensure this is the local verssion as well. If you need to modify/update/downgrade versions, using [nvm](https://github.com/nvm-sh/nvm). Node also includes npm and npx, which is needed to run this application. If you have installed node previously, check to make sure both [npm](https://docs.npmjs.com/cli/v6/commands/npm-install/) and [npx](https://www.npmjs.com/package/npx) are installed
   

4. Additionally, a local Postgres Database must be installed to run the application. You can install postgres [here](https://www.postgresql.org/download/), or through [homebrew](https://wiki.postgresql.org/wiki/Homebrew) (if using a Mac).
5. After downloading and setting up postgres, connect to your local postgres instance (varies depedending on device), and run the following command `CREATE DB <db-name>`. You must then set the env variables as follows to have the local database ready.
    ```
        DB_HOST=localhost
        DB_PORT=5432
        DB_USERNAME=<device-username>
        DB_PASSWORD=example
        DB_NAME=<db-name>
    ```
6. After the database is set up, you can run `npm install` to install all relevant node modules.
   
7. After the node modules are installed, you should be ready to run the application using the following commands:
   `npm run start:onboarding-api`: starts the backend
    `npm run start:client`: starts the client

# 🛣️ Project Management

The Project Management for this application is documented in the [tempus wiki](https://github.com/tempus-app/wiki/wiki)

Sprint Planning was done through [github projects](https://github.com/orgs/tempus-app/projects/1)

# 🎨 UI/UX Design
The Design System, along with the mockups built using figma can be viewed on the [wiki](https://github.com/tempus-app/wiki/wiki)


# 🧠 Technical Knowledge

## Database

Information about the tempus database, and datastore can be found [here](/docs/database/)

## Backend

Information about the tempus database, and datastore can be found [here](/docs/backend/)

## Frontend

Information about the tempus database, and datastore can be found [here](/docs/frontend/)
