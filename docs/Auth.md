# Authentication and Authorization Research

---

## Overall Findings

As we essentially have two services providers, the Onboarding app and the Timesheet app, that fall under the same app and share data, using SSO and JWT's will ensure easier communications and consistency.

To implement the authentication and authorization, best approach is using `Passport` library due to its extensive support and strategies. `Passport` has `Guards` which allow the handling of role-based access.

For strategies, will need to implement `local` and `JWT` strategies. These strategies are different authentication methods. `local` is username/password (but can be configured to take email instead). `JWT` is for JWTs.

For hashing, use `bcrypt`.

---

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
  - Module
  - Service
    - validateUser
    - login
    - signUp
    - comparePasswords
    - hashPassword (?)
  - Controller
    - Login
    - Sign Up
  - Strategies
    - local
    - JWT
  - Guards
    - Local
    - JWT

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
import * as bcrypt from 'bcrypt'

const saltOrRounds = 10
const password = 'random_password'
const hash = await bcrypt.hash(password, saltOrRounds)
```

---

## 2FA

TODO
