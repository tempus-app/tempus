![workflow](https://github.com/tempus-app/tempus/actions/workflows/github-action.yml/badge.svg)

<p align="center">

<img src="./docs/assets/../screenshots/assets/tempus_logo_1.png" width="80" height="80" style="{text-align:center}">
</p>

# Tempus

# Table Of Contents

- [Tempus](#tempus)
- [Table Of Contents](#table-of-contents)
- [🎯 Motivation & Project Description](#-motivation--project-description)
  - [⚙️ Core Features](#️-core-features)
    - [🌗 Phase 1 (Jan-April 2022)](#-phase-1-jan-april-2022)
    - [🌕 Phase 2 (September-April 2022)](#-phase-2-september-april-2022)
- [❤️ Contributors](#️-contributors)
- [🛣️ Project Management](#️-project-management)
- [🎨 UI/UX Design](#-uiux-design)
- [🧠 Technical Details](#-technical-details)
  - [🔨 Tech Stack Overview](#-tech-stack-overview)
    - [PostgreSQL](#postgresql)
    - [NestJs (TypeScript)](#nestjs-typescript)
    - [Angular](#angular)
    - [NX](#nx)
    - [Docker](#docker)
  - [📁 File Structure](#-file-structure)
  - [📝 Contributing](#-contributing)
  - [💼 Database](#-database)
  - [🔧 Backend](#-backend)
  - [🖌️ Frontend](#️-frontend)
  - [✨ Misc](#-misc)
  - [🎬 Testing](#-testing)
- [🧰 Installation + Running](#-installation--running)
  - [Docker Set Up](#docker-set-up)
  - [Local Set Up](#local-set-up)

# 🎯 Motivation & Project Description

Tempus is an application built for CAL & Associates, an enterprise resource management company, that scouts and hires resources to fulfil their clients (banks etc.) needs. Before Tempus, CAL undertook the manual work of reviewing the resources, building standardized resumes, and handling the onboarding process and project assignment for their resources, losing time.

Tempus aims to smoothen this process by allowing resources to build profiles within the application, and for CAL to invite, manage, review and assign a resource to CAL's Client projects.

Tempus II is a timesheet tracking web application. Resources can submit and track their hours, and projects that require supervisor approval can be tracked as well. Supervisors and Client Representatives must approve timesheets.

### 🎯 Tempus II Objectives
- Create a timesheet system where users can submit their hours and go through an approval process involving their supervisor and client representative
  - Timesheet:
    - Contracted users will submit timesheets that can be used to bill clients
    - Business owners can generate billing and cost reports
    - Supervisors and Client Representatives and approve or reject timesheets 

## ⚙️ Core Features

### 🌗 Phase 1 (Jan-April 2022)

- Invite Resource to Application
- Business Owner + Resource sign up flow
- Manage Resource View
- Resource Profile Page - View & Edit Profiles
- Download Standardized Resumes for Resources
- Resource Profile Approval Flow
  - Business Owner can reject/approve profile changes

### 🌕 Phase 2 (September-April 2022)

- Resume Parsing on sign up
- Discover Resources Pages (for business owners)
  - filter to find clients based on needs
- Support for multiple Profile Versions (Views)
- Office 365 Integration (connect to CAL accounts)
- Mass download of profiles

### 🌗 Phase 3 (Jan-April 2023)

- Complete UI Designs
- Complete Detailed System Requirements 
- Complete User Stories for all Stakeholders
- Complete ER Diagram and Database Design
- Finish Coding Database Entities, Models, Controllers, etc...
- Finish Coding UI Pages for Timesheet Submissions and Approvals
- Connect Database to the UI

### 🌕 Phase 4 (September-December 2023)

- Add calendary feature to timesheet application
- Add cost and billing report generation

# ❤️ Contributors

This project was built by:
- Team 2022
   - [Afrah Ali](https://github.com/aali179)
   - [Aman Riat](https://github.com/AmanRiat1)
   - [Gabriel Granata](https://github.com/gabrielgranata)
   - [Georges Chamoun](https://github.com/GCham5)
   - [Mustafa Ali](https://github.com/MustafaAli789)
   - [Ruwani De Alwis](https://github.com/ruwanidealwis)
  
- Team 2023
   - [Ovais Azeem](https://github.com/Ovais09)
   - [Ilyas Hassan](https://github.com/IlyasHassan)
   - [Alexander Choukeir](https://github.com/alexchoukeir)
   - [Zayd Ghazal](https://github.com/Zayood)
   - [Hened Saade](https://github.com/henedsaade)

# 🛣️ Project Management

## Tempus  
The Project Management for this application is documented in the [tempus wiki](https://github.com/tempus-app/wiki/wiki)

Sprint Planning was done through [github projects](https://github.com/orgs/tempus-app/projects/1)

## Tempus II  
The Project Management for this application is documented in the [Tempus II wiki](https://github.com/tempus-app/Tempus-II-Wiki/wiki)

Sprint Planning was done through [Jira](https://tempest2.atlassian.net/jira/software/c/projects/T2/boards/1/backlog?view=detail&selectedIssue=T2-4&issueLimit=100)

The project initial overview can be found here [Tempus II wiki](https://github.com/tempus-app/Tempus-II-Wiki/wiki/Team-Organization-and-Project-Outline)

# 🎨 UI/UX Design

The Design System, along with the mockups built using figma can be viewed on the [wiki](https://github.com/tempus-app/wiki/wiki)

# 🧠 Technical Details

## 🔨 Tech Stack Overview

<p float="center" align="center">
<img src="./docs/screenshots/assets/angular%20logo.png" width="120" height="120" style="{text-align:center}">

<img src="./docs/screenshots/assets/nestjs%20logo.svg" width="120" height="120" style="{text-align:center}">

<img src="./docs/screenshots/assets/postgreSQL%20logo.png" width="120" height="120" style="{text-align:center}">

</p>
<p align="center">
<img src="./docs/screenshots/assets/nx%20logo.png" width="150"  style="{text-align:center}">
<img src="./docs/screenshots/assets/docker%20logo.webp" width="150"  style="{text-align:center}">

</p>

### PostgreSQL

PostgreSQL was used as the database, as the data we were dealing with was structured, and there were many relationships between the entities. Learn more about [PostgreSQL](https://www.postgresql.org).

### NestJs (TypeScript)

NestJs was used to build the backend API, as it provided many MVC capabilites, and had out of the box support for testing, database integration, and allowed consistency with the frontend through the use of TypeScript. Learn more about [NestJs](https://nestjs.com).

### Angular

Angular is used for the frontend application, as it has out of the box support for the features we use such as routing, form control. Learn more about [Angular](https://angular.io).

### NX

NX was used to build our monorepo project, as it helps generate libraries, components for both the backend and frontend of our application. Learn more about [Nx](https://nx.dev).

### Docker

Docker is used to containerize the application so it is easier to run and deploy. Learn more about [Docker](https://angular.io).

## 📁 File Structure

An in-depth guide to understanding Tempus vile strucutre is located [here](/docs/FileStructure.md).

## 📝 Contributing

Contributions to the [backend](/docs/backend/Contributing.md) and the [frontend](/docs/frontend/Contributing.md) can be found in their own respective sections with the docs/ directory. Please follow the [following guide](docs/misc/RepoContributing.md).

## 💼 Database

Information about the tempus database, and datastore can be found [here](/docs/backend/database.md).

## 🔧 Backend

Information about the tempus backend,its functionalities, architecutre, and how to contribute can be found [here](/docs/backend/).

## 🖌️ Frontend

Information about the tempus client,its functionalities, how to contribute, can be found [here](/docs/frontend/).

## ✨ Misc

Misc information about the tempus repo, and contribution can be found [here](/docs/misc/).

## 🎬 Testing

Currently, only backend unit tests are implemented in main. More indepth discussion about the testing strategy can be found in the backend, and frontend (TODO) directories. Use the following commands to run tests:

- `npx nx run <project-name>:test`: runs test for an nx project (smallest scale)

- `npm run test:api:unit`: runs all backend unit test for the repo (smallest scale)

- `npm run test-unit:client`: runs all frontend unit tests for the repo (TODO)

# 🧰 Installation + Running

Docker can be used to install and run the application. While docker does heavily smoothen set up, however, it does take longer to build, load and will consume more of your CPU power.

The first steps are general to both docker & non-docker set up.

1. Set up `.env` file in the root directory, following the [env.example file](/.env.example). Any value that is filled in the example file can be copied into the env variable as well for development purposes.
2. To set up the <b>test email server</b>, head over to [ethereal.com](https://ethereal.email), and create an account. After the account is filled, you can fill in the following env variables. To test if the emails have gone through properly, login to Etheral and check the messages tab.

   ```
   EMAIL_USERNAME=<username>
   EMAIL_PASSWORD=<password>
   EMAIL_ADDRESS=<username>
   ```

3. To set up the <b>resume parser</b> (which is currently under refactor):
   - Clone the resume-parser repo and follow the instructions listed in the README of the repo.
   - Run the application by entering in python main.py in the pipenv shell
   - The resume's uploaded will now be parsed through this endpoint

### Docker Set Up

3. To run using docker, you must first install docker, following the instructions [here](https://docs.docker.com/get-docker/)
4. Additionally, if running through only docker, set the .env files as follows:
   `DB_HOST=postgres DB_PORT=5432 DB_USERNAME=postgres DB_PASSWORD=<password> DB_NAME=postgres`
   If you want to support both docker & local development, it is recommended to set these variables directly in the [docker-compose.yml](docker-compose.yml) file.

5. After docker is successfully installed, you should be able to use the following commands to run/stop the containers
   - `docker-compose up`: starts up docker container for the onboarding api (our backend app), onboarding client (our frontend), postgres database (image) and adminer (image)
     - After the containers come up, visit http://localhost:4200 to see the application running
     - To debug database issues, head over to http://localhost:8080, this should open up adminer which shows the postgres database, use the credentials in your env file, and set system to postgreSQL.
   - `docker-compose build`: rebuilds the containers, especially useful if there are new changes (that aren't reflected when running `docker-compose up`)
   - `docker-compose down`: stops and removed any of the running containers
   - Alternatively, to save on resources, certain containers can be built through the docker compose rather than all of them. For example, if you wish to run the client and api locally but need the database, you may run it by entering in `docker-compose up postgres`. By specifiying the names of the containers, only those entered will be brought up.

### Local Set Up

3. First install node, [here](https://nodejs.org/en/download/). The current version of node run is `v16.14.0`. To avoid unneeded modifications to package lock files, ensure this is the local version as well. If you need to modify/update/downgrade versions, using [nvm](https://github.com/nvm-sh/nvm). Node also includes npm and npx, which is needed to run this application. If you have installed node previously, check to make sure both [npm](https://docs.npmjs.com/cli/v6/commands/npm-install/) and [npx](https://www.npmjs.com/package/npx) are installed

4. Additionally, a local Postgres Database must be installed to run the application. You can install postgres [here](https://www.postgresql.org/download/), or through [homebrew](https://wiki.postgresql.org/wiki/Homebrew) (if using a Mac).
5. After downloading and setting up postgres, connect to your local postgres instance (varies depending on device), and run the following command `CREATE DB <db-name>`. You must then set the env variables as follows to have the local database ready.
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
	 
	 <hr>
	