# Integrating the Microsoft Graph API

Tempus calls the [Microsoft Graph REST API](https://developer.microsoft.com/en-us/graph) to create Outlook accounts within the client's Azure Active Directory domain upon resource signup.

---

-   [Integrating the Microsoft Graph API](#integrating-the-microsoft-graph-api)
    -   [1. Authorization flow](#1-authorization-flow)
    -   [2. Setup the Azure application](#2-setup-the-azure-application)
        -   [Prerequisites](#prerequisites)
            -   [2.1 Register the application in Azure Active Directory](#21-register-the-application-in-azure-active-directory)
            -   [2.2 Grant permissions](#22-grant-permissions)
            -   [2.3 Generate Client secret](#23-generate-client-secret)
    -   [3. Configuring the environment](#3-configuring-the-environment)
        -   [Test environment](#test-environment)
    -   [4. Integrated features](#4-integrated-features)
        -   [Account creation](#account-creation)
        -   [Account deletion](#account-deletion)
        -   [Limitations](#limitations)

---

## 1. Authorization flow

Tempus requires creation of user accounts from a state where there is no signed-in user present. As such, an administrator must grant the application as a whole the required Application Permissions to make requests to Microsoft Graph with it's own identity. This follows Microsoft's [OAuth client credentials flow](https://learn.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow):

1. The Tempus application, registered in Azure AD with the required permissions, requests an authentication token from [Microsoft Identity platform](https://learn.microsoft.com/en-us/azure/active-directory/develop/v2-overview), providing the `client_id` and `client_secret`
2. Microsoft Identity platform grants this token, which is supplied when the application makes requests to Microsoft Graph

## 2. Setup the Azure application

### Prerequisites

-   An Azure account with an active subscription
-   One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator.

#### 2.1 Register the application in Azure Active Directory

Azure Active Directory is an identity management service where Outlook accounts pertaining to a specific organizatin (domain) are hosted. Within Azure AD, we can grant applications and their users access to various Microsoft services, including the Graph API.

The Tempus application must be registered through the Azure app registration portal following the steps outlined [here.](https://learn.microsoft.com/en-us/graph/auth-register-app-v2)

#### 2.2 Grant permissions

To configure application permissions for your app in the Azure app registrations portal, under an application's API permissions page, choose Add a permission, select Microsoft Graph, and then choose the permissions your app requires under Application permissions. All Application permissions will require the consent of a domain administrator. Ensure that you are granting the least priveleged permisson that is needed by the application.

For a full list of permissions required for Microsoft Graph requests, see the refrence [document.](https://learn.microsoft.com/en-us/graph/permissions-reference)

#### 2.3 Generate Client secret

Navigate to your registered application in the Azure app portal and generate a new Client Secret under Credentials & Secrets. Supplying this secret will allow Microsoft Identity platform to verify the application identity when requesting auth tokens. Make sure you copy the secret somewhere safe as it will only be shown once. Please keep in mind that the generated secrets have expiration dates and a new one must be generated when required.

## 3. Configuring the environment

To integrate Microsoft Graph, pass the following environment variables to your application. For local development, this can be set in the `.env` file at the root of the repository. For production, this can be set in the Azure configuration file.

```
CLIENT_ID=< from Azure app registration >
TENANT_ID=< from Azure app registration >
CLIENT_SECRET=< secret generated from Credentials & Secrets >
AZURE_DOMAIN=< domain name, e.g. @tempusADoutlook.onmicrosoft.com >
```

#### Test environment

The Github Actions CI pipeline runs unit tests for `graph.service.ts` and other services in its module; a test Azure environment has been created for this purpose with the domain `@tempusADoutlook.onmicrosoft.com` and credentials configured with Github Secrets.

## 4. Integrated features

### Account creation

Tempus utilizes Microsoft Graph to create resource accounts on signup with their basic profile information (location, contact info) and generates a temporary password for them to login with. They will be prompted to reset their password on first login. The account emails are generated in the form `firstName.lastName@domain.com` and saved to the `ResourceEntity` of the database.

The temporary password is only displayed once and not stored in the system; if the resource fails to login to their account, the Azure admin must manually create a new account for them. Accounts are enabled once created and will not expire.

### Account deletion

Outlook accounts created by Tempus and associated with a resource are deletable.

### Limitations

-   Tempus currently does not support syncing information from Azure AD. This means that if resource Outlook accounts are manually created in Azure, they will not be traceable to the Tempus resource account. As such, the Azure email will not be displayed on their profile, and deleting this resource will not delete any manual account created under their name.
-   Tempus currently does not notify resources or business owners of Azure account creation failures. Since it is not critical to the signup flow, a resource will not be informed if this step fails. However, in the future it would be worthwhile to notify business owners of account creation failures so they can manually create them for resources.
