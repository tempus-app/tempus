# Logging

---

- [Logging](#logging)
  - [General Overview](#general-overview)
    - [Configuration](#configuration)
      - [NestJS Logger](#nestjs-logger)
      - [Pino](#pino)
    - [Log levels](#log-levels)
    - [Middleware](#middleware)
    - [Service logging](#service-logging)
  - [Contributing](#contributing)
    - [How to add logging](#how-to-add-logging)
  - [Resources](#resources)





---

## General Overview

For logging in Tempus, we have opted to use a mix of the [built-in NestJS logger](https://docs.nestjs.com/techniques/logger) and [Pino](https://github.com/iamolegga/nestjs-pino). This allows for easy installation, implementation, and configuration within our app while also providing the easy integration and detailed information of the Pino logging. The built-in logging library can be found [here](../../libs/api/shared/logging/src/lib/middleware/logger.middleware.ts).


### Configuration

#### NestJS Logger

The logger is configured in [app-module](../../apps/onboarding-api/src/app/app.module.ts) as shown below:

```ts
export class AppModule {
 	configure(consumer: MiddlewareConsumer) {
 		consumer.apply(LoggerMiddleware).forRoutes('*');
 	}
 }
```
The `forRoutes` determines which routes/controllers the logger middleware will affect. As of now, it will log all routes in the app.

#### Pino

Pino is also configured in [app-module](../../apps/onboarding-api/src/app/app.module.ts).

```ts
LoggerModule.forRoot({
	pinoHttp: {
		customProps: (req, res) => ({
			context: 'HTTP',
		}),
		transport: {
			target: 'pino-pretty',
		},
	},
}),
```

Additionally, in [main.ts](../../apps/onboarding-api/src/main.ts), ensure NestJS utilizes Pino.

```ts
app.useLogger(app.get(Logger));
```
From here, NestJS automatically identifies which logger to use, allowing for seamless use of the logger within the application.


### Log levels

The logger provides the following log methods:

- log
- warn
- error
- verbose
- debug

### [Middleware](../../libs/api/shared/logging/src/lib/middleware/logger.middleware.ts)

This middleware is used to automatically log HTTP requests. This only logs successful requests. Requests that throw an error are caught and logged via the [global http exception filter](../../libs/api/shared/feature-core/src/lib/global-http-exception.filter.ts). Similar to the exception filter, six pieces of information are logged in the message:

- HOST
- REQUEST METHOD
- REQUEST URL
- STATUS CODE
- MESSAGE
- RESPONSE TIME


### Service logging

The logger can also be used to log services. This can be done by adding the logger to the service. Please see [Contributing](#contributing) on how to do this. 

An example of service logging can be seen in [AuthService](../../libs/api/shared/feature-auth/src/lib/auth.service.ts). The example below logs whenever a user logs in.

```ts
this.logger.log(`${partialUser.email} logged in as ${partialUser.roles}`);
```


## Contributing

### How to add logging

To add the logger, first ensure the `Logger` is a provider in the feature's `module.ts`. See example below.

```ts
@Module({
	imports: [ApiSharedEntityModule, CommonModule, PassportModule, ConfigModule, JwtModule.register({})],
	controllers: [AuthController],
	providers: [
		AuthService,
		LocalStrategy,
		JwtStrategy,
		JwtRefreshStrategy,
		LocalAuthGuard,
 		JwtAuthGuard,
 		JwtRefreshGuard,
 		CommonService,
 		Logger,
 	],
 	exports: [AuthService, LocalAuthGuard, JwtAuthGuard, JwtRefreshGuard],
 })
 ```


 Next, create a private instance of the logger within the service you wish to log. Ensure to provide the name of the service when initializing the logger. See example below.

 ```ts
 private readonly logger = new Logger(AuthService.name);
 ```

 The logger is now ready to be used. Ensure to use the current logging level.


 ## Resources

  - [Introduction to logging with the built-in logger and TypeORM](https://wanago.io/2021/10/04/api-nestjs-logging-typeorm/)
  - [Logger - NestJS Docs](https://docs.nestjs.com/techniques/logger)
  - [Middleware - NestJS Docs](https://docs.nestjs.com/middleware)
  - [How to use the NestJS Logger (plus Pino setup)](https://www.tomray.dev/nestjs-logging#nestjs-logger-with-pino)
