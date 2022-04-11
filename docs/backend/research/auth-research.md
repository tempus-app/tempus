# Authentication and Authorization Research


---
- [Authentication and Authorization Research](#authentication-and-authorization-research)
  - [Overall Findings](#overall-findings)
  - [Implementation](#implementation)
  - [Sources](#sources)
    - [Authentication](#authentication)
    - [Authorization](#authorization)
    - [Encryption and Hashing](#encryption-and-hashing)
      - [Example](#example)
    - [Additional Resources](#additional-resources)
---
## Overall Findings

As we essentially have one services providers, the Onboarding app, using SSO and JWT's will ensure easier communications and consistency.

To implement the authentication and authorization, the best approach is using `Passport` library due to its extensive support and strategies. `Passport` has `Guards` which allow the handling of role-based access.

For strategies, will need to implement `local` and `JWT` strategies. These strategies are different authentication methods. `local` is username/password (but can be configured to take email instead). `JWT` is for JWTs.

For hashing, use `bcrypt`.


## Implementation

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
## Sources

### [Authentication](https://docs.nestjs.com/security/authentication#implementing-passport-local)

The best approach will be using the [`Passport`](https://www.passportjs.org) library. It is easy to use and wildly supported. Additionally, it features a large selection of [strategies](http://www.passportjs.org/packages/) that implement various auth techniques, including local, JWT, etc.

### [Authorization](https://docs.nestjs.com/security/authorization#basic-rbac-implementation)

With `Passport`, we can use [Guards](https://docs.nestjs.com/guards) which determine whether a given request will be handled by the router handler or not. Through `Guards` and `AuthGuards`, we can easily implement role-based access.

### [Encryption and Hashing](https://docs.nestjs.com/security/encryption-and-hashing#hashing)

Recommend using `bcrypt` package.

#### Example

```js
import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;
const password = 'random_password';
const hash = await bcrypt.hash(password, saltOrRounds);
```

For better security, a unique salt should be used per user to ensure a unique hash for the same passwords amongst different users.

### Additional Resources

- Really good YouTube [video](https://www.youtube.com/watch?v=_L225zpUK0M) implementing authentication in NestJS.
- Good [article](https://dev.to/thisdotmedia/angular-and-the-rest-nest-js-and-jwt-dja)

