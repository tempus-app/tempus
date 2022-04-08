# Authentication and Authorization Documentation

---
# Table of Contents
1. [Research](#research)
2. [General Overview](#overview)
3. [Resources](#resources)
4. [Fourth Example](#fourth-examplehttpwwwfourthexamplecom)

___

## Research

### Overall Findings

As we essentially have two services providers, the Onboarding app and the Timesheet app, that fall under the same app and share data, using SSO and JWT's will ensure easier communications and consistency.

To implement the authentication and authorization, best approach is using `Passport` library due to its extensive support and strategies. `Passport` has `Guards` which allow the handling of role-based access.

For strategies, will need to implement `local` and `JWT` strategies. These strategies are different authentication methods. `local` is username/password (but can be configured to take email instead). `JWT` is for JWTs.

For hashing, use `bcrypt`.


### Implementation

- Ensure installation of various libraries and strategies.

  - Passport
  - Local strategy
  - JWT strategy
  - bcrypt

  ```
  npm install @nestjs/passport passport passport-local passport-jwt bcrypt
  ```

- Implement an Auth lib

To implement an Auth lib, we essentially require all of the components below. 

  - Module
  - Service
  - Controller
  - Strategies
  - Guards


---

## General Overview

Below is an overview of the Auth file structure.
```
feature-auth
|
└───src
│   │   
|   └───lib
|       |
│       └─── Guards
│           │   index.ts
│           │   jwt-auth.guard.ts
│           │   jwt-refresh.guard.ts
│           │   local-auth.guard.ts
│           │   ....
│       └─── Strategies
│           │   index.ts
│           │   jwt-refresh.strategy.ts
│           │   local.strategy.ts
│           │   ....
│       │   auth.controller.ts
│       │   auth.module.ts
│       │   auth.service.ts
│       │   ....
```

### Guards and Strategies

Two key components of the Auth library are `Strategies` and `Guards`. These handle the majority of the logic, such as validating JWTs, checking permissions, ensuring proper credentials, etc. In most cases, `Strategies` and `Guards` are tied together to validate a request.

#### `Local Guard and Strategy`

This is compromised of `local-auth.guard.ts` and `local.strategy.ts` and is used on the `Login` endpoint. It assists in handling authentication. A flow is detailed below.

##### Login Flow Example
1. User logs in by hitting `Login` endpoint
```ts
	@UseGuards(LocalAuthGuard)
	@Post('login')
	login(@Request() req): Promise<Tokens> {
		return this.authService.login(req.user);
	}
```
2.  [LocalAuthGuard](../../libs/api/shared/feature-auth/src/lib/guards/local-auth.guard.ts) takes request (email, password) and uses [Local Strategy](../../libs/api/shared/feature-auth/src/lib/strategies/local.strategy.ts) to validate and find the user by calling the `validateUser()` method in [Auth Service](../../libs/api/shared/feature-auth/src/lib/auth.service.ts).

3. If the user is found, `Local Strategy` returns the user within the `Request` object. The user can be accessed through `req.user`.
```ts
	return this.authService.login(req.user);
```

#### `JWT Access Token Guard and Strategy`

This is compromised of `jwt-auth.guard.ts` and `jwt.strategy.ts` and is used to handle requests that require a JWT Access Token to ensure authentication of the user. It assists in handling authentication. If an endpoint is protected by `JwtAuthGuard`, it requires that a JWT Access Token is sent in the bearer header alongside the request. Once the endpoint is hit, the `JwtAuthGuard` calls the `JwtStrategy`. The strategy then validates, decodes and de-constructs the token into the [jwtPayload DTO](../../libs/shared/domain/src/lib/dtos/common-dtos/jwtpayload.dto.ts). This returns the email and role(s) of the owner of the JWT Token. The `JwtPayload` can then be accessed in `req.user` in the controller.

#### `JWT Refresh Token Guard and Strategy`

This is compromised of `jwt-refresh.guard.ts` and `jwt-refresh.strategy.ts` and is used to handle requests to recieve a new JWT Access Token. It assists in handling authentication. The `JwtRefreshGuard` is used on the `Refresh` endpoint in the `Auth Controller`. When that endpoint is hit, the guard calls the strategy which extracts the JWT Refresh Token from the request header. It then validtes, decodes and de-constructs the token into [jwtRefreshPayloadWithToken DTO](../../libs/shared/domain/src/lib/dtos/common-dtos/jwtRefreshPayloadWithToken.dto.ts). This DTO houses the email of the owner of the refresh token, alongside the actual encoded token. The `JwtRefreshPayloadWithToken` can then be accessed in `req.user` in the controller.


#### `Roles Guard and Decorator`

This is compromised of `roles.guard.ts` and `roles.decorator.ts` and it handles authorization in certain requests. `Roles.decorator.ts` simply defines a custom decorator to use the [RoleType enums](../../libs/shared/domain/src/lib/dtos/enums/roles.ts). The guard below is an example of an endpoint that requires a valid JWT Access Token and that the user making the request is a BUSINESS_OWNER. When this endpoint is hit, the regular JWT Guard and Strategy flow is done. In the `roles.guard.ts`, the JWT Payload is extracted and the roles included in it are checked against the roles indicated in the endpoint guard. This ensures proper authorization.

```ts
@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleType.BUSINESS_OWNER)
	@Get('basic')
	async getAllResourceProjInfo(): Promise<UserProjectClientDto[]> {
		return this.resourceService.getAllResourceProjectInfo();
	}
```

#### `Permission Guard`

This is compromised of `permission.guard.ts` and it handles authorization in certain requests, specifically requests that handle retrieving or updating user information. This guard checks that the user making the request is either a BUSINESS_OWNER (admin) or that the information they are requesting belongs to them. In `permission.guard.ts`, the request is extraccted. Since this guard can be placed on GET, POST, PUT, or DELETE endpoints, the request might have a body or a parameter. Hence, the user (JWT Access Token), body, and parameters are extracted from the request object. The guard then checks if a paramter exists. If it does, which should always be an ID of a user, it finds the user using the [CommonService](../../libs/api/shared/feature-common/src/lib/common.service.ts).If no paramter exists in the request, it checks the body as in these cases, the body should be an entity that has an ID. The guard then checks if the user making the request is a BUSINESS_OWNER and if not, if the information they requested and/or wish to edit, is theirs. An example endpoint can be seen below.

```ts
	@UseGuards(JwtAuthGuard, PermissionGuard)
	@Delete(':userId')
	async deleteUser(@Param('userId') userId: number): Promise<void> {
		return this.userService.deleteUser(userId);
	}
```

#### `Views Guard`

This is compromised of `views.guard.ts` and it handles authorization in certain requests, specifically requests that handle retrieving or updating view information. This guard is very similar to `Permission Guard` except that it handles requests related to views. In `views.guard.ts`, the request is extracted and from it, the parameters are retrieved. Using the `CommonService`, the owner of the view requested is found. Finally, it checks whether the user making the request is a BUSINESS_OWNER, and if not, the user owns the view requested. An example endpoint can be seen below.

```ts
	@UseGuards(JwtAuthGuard, ViewsGuard)
	@Delete('/:viewId')
	async deleteView(@Param('viewId') viewId: number): Promise<void> {
		await this.viewSerivce.deleteView(viewId);
	}
```

---

## Resources

### [Authentication](https://docs.nestjs.com/security/authentication#implementing-passport-local)

Best approach will be using [`Passport`](https://www.passportjs.org) library. It is easy to use and wildly supported. Additionally, it features a large selection of [strategies](http://www.passportjs.org/packages/) that implement various auth techniques, including local, JWT, etc.

### [Authorization](https://docs.nestjs.com/security/authorization#basic-rbac-implementation) (and [Guards](https://docs.nestjs.com/guards))

With `Passport`, we are able to use `Guards` which deteremine whether a given request will be handled by the router handler or not. Through `Guards` and `AuthGuards`, we are able to easily implement role-based access.

### [Encryption and Hashing](https://docs.nestjs.com/security/encryption-and-hashing#hashing)

Recommend using `bcrypt` package.

#### Example

```js
import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;
const password = 'random_password';
const hash = await bcrypt.hash(password, saltOrRounds);
```

For better security, a unique salt should be used per user to ensure a unique hash for same passwords amongst different users.

### Additional Resources

- Really good YouTube [video](https://www.youtube.com/watch?v=_L225zpUK0M) implementing authentication in NestJS.
- Good [article](https://dev.to/thisdotmedia/angular-and-the-rest-nest-js-and-jwt-dja)

---

## 2FA

TODO
