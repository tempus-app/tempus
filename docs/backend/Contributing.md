# Contributing to the Backend

This document details how to add and modify the backend. To understand the file structure and layout of the backend, refer to this [document](./FileStructure.md).

## Creating the Library

The main component of a new aspect of the backend is creating a library. To understand a library, we can look at the example under `libs/api/onboarding-api`, there are a few libraries found here, including the one named `feature-account`. This `feature-account` library represents all of the backend logic associated with the account feature. This groups all the [controllers](#creating-a-controller) and [services](#creating-a-service) and [tests](./testing.md) under the module.

Adding a library is crucial when adding major elements to the backend. Typically, this will be needed when a new feature or area of the application is added. It groups together contexts which are related to each other, such as the api associated with the tempus `accounts`. Libraries hold all of the relevant code such as the html, css, and typescript needed to handle the API calls. The following command describes how to generate a NestJS library.

```
npx nx generate @nrwl/nest:library --name=<library-name> --directory=<directory-path>
```

NX assumes library generation begins at the `libs` level. To generate a new library a=under `libs/api/onboarding-api` the command would be:
`npx nx generate @nrwl/nest:library --name=test --directory=api/onboarding-api`

Generating a library will generate a module, but the naming conventions will not follow the general conventions of tempus, so the files and classes must be renamed.

This is an example of a module generated with NX after being developed:
```
import { forwardRef, Module } from '@nestjs/common';
...

@Module({
	imports: [
		ApiSharedEntityModule,
		forwardRef(() => ProfileModule),
		EmailModule,
		ConfigModule,
		AuthModule,
		CommonModule,
	],
	controllers: [UserController, LinkController],
	providers: [ResourceService, UserService, LinkService],
	exports: [ResourceService, UserService, LinkService],
})
export class AccountModule {}
```

The `AccountModule` imports other modules from throughout the app. The benefit of libraries that functionality can be shared throughout different modules. This module specifically has a few `controllers` associated with it. Controllers will be discussed more. It also provides and exports the `services` which will also be discussed more in this document.

## Creating a Controller

NestJS controllers are disccused in detail on the [NestJS Website](https://docs.nestjs.com/controllers)

Controllers are the core of the backend. NestJS builds controllers on top of ExpressJS endpoints, so it should be familiar to you if you are familiar with express. Controllers are provided in the NestJS module to "control" the flow of the API calls from the client. For example, we can look at the `user.controller.ts` file, found in the `feature-account` module example discussed in the previous [section](#creating-the-library).

We will dissect the following code snippet:

```
import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Request } from '@nestjs/common';

...
...
@ApiTags('User')
@Controller('user')
export class UserController {
	constructor(
		private userService: UserService,
	) {}

	@Post()
	async createUser(@Body() user: CreateUserDto): Promise<User> {
		return this.userService.createUser(user);
	}

    @Delete(':userId')
	async deleteUser(@Param('userId') userId: number): Promise<void> {
		return this.userService.deleteUser(userId);
	}
}
```

The `ApiTags` import is associated with [Swagger](./swagger.md). Discussed more in the swagger document.

The `@Controller` decorator is the core of the UserController. It specifies that the following class should be treated by NestJS as a controller, a wrapper around the different endpoints found in the class. The `user` value passed to the decorator specifies the endpoints will be under the `/user/` path in the API. 

The constructor of the controller imports a `service`, which will be discussed in the next section. For now, we can assume a service is used to perform the logic of the controller.

The `@Post` decorator is a post method to the `/user` endpoint, as no argument has been passed in the decorator. The `@Body()` represents the body object of the request. The type of the body for this specific method is `CreateUserDto`. DTOs are discussed [here](./dto.md), but represents the object that should be passed into the method. This method specifically calls the user service to create a user with the body object.

The `@Delete` decorator is a delete method to the `/user/<userId>` endpoint. The controller will match the URL pattern and extract the userId in the form of an `@Param()` as `userId` is passed into the decorator. We can use `Param` to extract paramaters from the URL and use them to call specific methods. This is typically used for IDs, and the Body is typically used for large objects as DTOs can be shared between frontend and backend.

### Creating a new Endpoint

Creating a new endpoint is fairly simple as it just extends the creating a controller section. In order to create an endpoint, the decorators such as `@Get()` or other crud operations can be used to decorate a new method. This new method will perform some action by calling a service, discussed in the next section. A new `service` method may need to be created, discussed further below.

## Creating a Service

NestJS providers are discussed in more detail [here](https://docs.nestjs.com/providers)

A service is responsible for data storage and retrieval, as well as other logic associated with a specific feature. For this example, we can continue to look at User related methods and example the `user.service.ts` file following the previous `feature-account` examples. In order to understand how to create a service, we can look at this code and see how to implement our own.

We will examine the following code snippet:

### `user.service.ts`
```
import { Injectable } from '@nestjs/common';
import { UserEntity } from '@tempus/api/shared/entity';
import { CommonService } from '@tempus/api/shared/feature-common';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		private commonService: CommonService,
	) {}

	async createUser(user: CreateUserDto): Promise<User> {
		const userEntity = UserEntity.fromDto(user);
		userEntity.password = await this.hashPassword(userEntity.password);
		const createdUser = await this.userRepository.save(userEntity);
		createdUser.password = null;
		return createdUser;
	}

    async getUser(token: JwtPayload): Promise<User | Resource> {
		const userEntity = await this.commonService.findByEmail(token.email);
		return userEntity;
	}
}
```

The user service is an `@Injectable()` provider, this tells NestJS that the service can be used throughout, and injected through NestJS' built-in dependency injection.

We can see this in action with the `CommonService` being provided in the constructor. By specifying `private commonService: CommonService` in the constructor, we are telling NestJS we want this service to be injected in this class. The reason we have access to this service is through the shared imports of the module discussed before. 
The `CommonModule` imported by the `AccountModule` provides the `CommonService` we are using. This gives us access to all the services' methods in the current service.

The `UserService` also injects a `Repository`, specifically one associated with the `UserEntity`. `Entities` and `DTOs` will be discussed in more detail in the next section.

The UserService has different methods associated with it, which can be called by classes that inject the service, such as the `UserController`. In this example, we will look at the `createUser` and `getUser` methods.

The `createUser` method is used to create a user from the DTO provided. The service method interacts with the `userRepository` to create entities and associations. The `getUser` method is similar in that it interacts with a repository, but we can see it uses a different service to achieve its goal. The `CommonService` that was injected is being used in this service, allowing for easy separation of concerns throughout libraries and services.

### Creating a Service

To create a service, the template shown here can be followed. The create new methods, the process is simple as its just creating a function for the class. These methods can be used by places where the service is injected.

## Models, Entities and DTOs

The core of the backend objects are Models, Entities, and DTOs. TypeORM is used for the entities, as its an object relational mapping tool for TypeScript to interact with the database.
Documentation for NestJS TypeORM can be found [here](https://docs.nestjs.com/techniques/database) and documentation for TypeORM can be found [here](https://typeorm.io/)

### Models
At the core of the Objects are `Models` which are created to represent the Entities and their properties. Models are found in the `libs/shared/domain/src/lib/models` directory. These models are shared between the frontend and backend. We can look at the `account-models` directory to continue with our [example](#creating-the-library).

The `user.model.ts` file represents the properties that should be associated with a User. The model is the core of the backend and is what method signatures are defined as returning.
```
import { RoleType } from '../../enums';

export interface User {
	id: number;

	firstName: string;

	lastName: string;

	email: string;

	password: string;

	refreshToken: string;

	roles: RoleType[];
}
```

### Entities
After creating a model, we can create a `TypeOrm Entity` which implements the model. This entity will be read by the database to create new tables and necessary relations and join tables. 
Entities are found in the `libs/api/shared/entity` directory. We will examine the `user.entity.ts` file in the `account-entities` directory to continue with our [example](#creating-the-library).

A TypeOrm entity is defined using the `@Entity()` decorator, which lets NestJS know this entity must be created in the database. 

```
export class UserEntity implements User {
	constructor(
		id?: number,
		firstName?: string,
		lastName?: string,
		email?: string,
		password?: string,
		roles?: RoleType[],
	) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.password = password;
		this.roles = roles;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	firstName: string;

	@Column({ nullable: true })
	lastName: string;

	@Column({ nullable: true })
	email: string;

	@Column({ nullable: true })
	password: string;

	@Column({ nullable: true })
	refreshToken: string;
}
```

Columns should be defined to follow the properties defined in the `User` model. This will ensure the required columns (defined by the `@Column()` decorator for each property) are created in the table.

The constructor of the entity has each property as a parameter. The arguments passed in will be assigned to the properties of the entitiy when creating a `new UserEntity()`.

Entities must also define their `fromDto()` method, as shown below.
```
	public static fromDto(dto: CreateUserDto | UpdateUserDto): UserEntity {
		if (dto == null) return new UserEntity();
		const id = dto instanceof CreateUserDto ? undefined : dto.id;
		return new UserEntity(id, dto.firstName, dto.lastName, dto.email, dto.password, dto.roles);
	}
```
The use of this method is to return an Entity object from a DTO. Use of this, for example, would be parsing a CreateUserDto to return a `UserEntity` to be saved in the Database. This will be discussed in furthur in the next section.

To add columns to the Entity, its as simple as defining a property in the model and entity, then adding the Column decorator.

### DTOs

After creating a model and an entity, and defining a new library, controller and service, you will need to create a DTO for required methods. There are two kinds of DTOs in the repository, those found in `libs/api/shared/dtos` and those found in `libs/shared/domain/src/lib/dtos`.

The DTOs found in the shared library are the ones we will look at first, specifically the `account-dtos/user` dtos. If we examine the `IcreateUser.dto.ts` file to continue with our [example](#creating-the-library), we will see that it defines the object that must be used by the frontend and backend to create a new `User`. We can call these `IDto`s.

```
import { RoleType } from '../../../enums';

export interface ICreateUserDto {
	firstName: string;

	lastName: string;

	email: string;

	password: string;

	roles: RoleType[];
}
```
These DTOs are shared between the Backend and Frontend, as they define what the client must send to the API, as well as what the API must receive to transfer data between the client and server. If the `UserEntity` is ever edited to contain more columns, the DTO will need to be updated to reflect what the client will be sending to the server. If a new Entity was created, a new `IDto` will need to be created to define what data is to be transfered.

The other DTOs we must define are the dtos in the shared api library. These DTOs are to be used by the backend, as they contain swagger logic which cannot be used by the client. Looking at the `account-dtos/user` directory we can examine the `create-user.dto.ts` file.

```
import { ApiProperty } from '@nestjs/swagger';
import { ICreateUserDto, RoleType } from '@tempus/shared-domain';

export class CreateUserDto implements ICreateUserDto {
	@ApiProperty()
	firstName: string;

	@ApiProperty()
	lastName: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	password: string;

	@ApiProperty({ enum: ['BUSINESS_OWNER', 'SUPERVISOR'] })
	roles: RoleType[];

	constructor(firstName: string, lastName: string, email: string, password: string, roles: RoleType[]) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.password = password;
		this.roles = roles;
	}
}
```
We can see that this DTO implements one of the `IDto`s discussed previously. This ensures the backend specific and shared DTOs always contain the same properties. We use the `ApiProperty()` decorator to ensure [Swagger](https://docs.nestjs.com/openapi/introduction) recognizes these properties as part of the DTO. The constructor of these DTOs contains the properties so objects can easily be created.

Backend methods, such as those in the `user.controller.ts` file should have these backend DTOs as parameters for the methods. Swagger will recognize the DTO and form the proper OpenAPI documentation.  

Creating new DTOs consists of defining `IDto`s and `DTO`s for the frontend and backend to use. These DTOs represent operations that need to be performed on the database to different `Entities`, and generally define properties that match with these Entities. 


## Creating a Guard
Guards are associated with `controller` endpoints. More information about `Guards` can be found [here](./Auth.md)

## Creating Tests
Tests are written for `controllers` and `services` on the backend.
More information about `tests` can be found [here](./testing.md)